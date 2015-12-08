/*
 * Implemented using the iRobot CREATE's Open Interface 
 *                                      by Hyeonsu Kang
 *                                        Dec. 02, 2015
 */

#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>
#include "math.h"

#include <netinet/in.h>

#include <sys/types.h> 
#include <sys/socket.h>
#include <sys/stat.h>

#include "Create.h"

int angle;
int x_0, y_0; 
int x_i, y_i;

/* From here to the point indicated, I have taken source code from the web. */
void error(const char *msg)
{
  perror(msg);
  exit(1);
}

int setupSerial(int serfd, int speed) {
  struct termios tty;

  memset (&tty, 0, sizeof tty);
  if (tcgetattr (serfd, &tty) != 0)
  {
    error("[!] ERROR on tcgetattr");
    return -1;
  }

  cfsetospeed (&tty, speed);
  cfsetispeed (&tty, speed);

  tty.c_cflag = (tty.c_cflag & ~CSIZE) | CS8;     // 8-bit chars
  tty.c_iflag &= ~IGNBRK;         // disable break processing
  tty.c_lflag = 0;                // no signaling chars, no echo,
  // no canonical processing
  tty.c_oflag = 0;                // no remapping, no delays
  tty.c_cc[VMIN]  = 1;            // read blocks
  tty.c_cc[VTIME] = 5;            // 0.5 seconds read timeout

  tty.c_iflag &= ~(IXON | IXOFF | IXANY); // shut off xon/xoff ctrl

  tty.c_cflag |= (CLOCAL | CREAD);// ignore modem controls,
  // enable reading
  tty.c_cflag &= ~(PARENB | PARODD);      // shut off parity
  tty.c_cflag |= 0;
  tty.c_cflag &= ~CSTOPB;
  tty.c_cflag &= ~CRTSCTS;

  if (tcsetattr (serfd, TCSANOW, &tty) != 0)
  {
    error("[!] ERROR on tcsetattr");
    return -1;
  }
  return 0;
}

/* <- Source code taken from the web ends here */

int stop(int serfd, char *res) {
  usleep(1000000);
  bzero(res, sizeof res);
  res[0] = START;
  res[1] = FULL;
  write(serfd, res, 2);

  usleep(100000);

  res[0] = DRIVE;
  res[1] = 0;
  res[2] = 0;
  res[3] = 0;
  res[4] = 0;

  return write(serfd, res, 5);
}

int go(int serfd, int distance, char *res) {
  usleep(1000000);
  bzero(res, sizeof res);
  res[0] = START;
  res[1] = FULL;
  write(serfd, res, 2);

  usleep(100000);
  /* There is not an obstacle */
  res[0] = SCRIPT;
  res[1] = 0x0D;
  res[2] = DRIVE_DIRECT;
  res[3] = (LINEAR_VEL >> 8) & 0xFF; /* Default speed is 500mm/s */
  res[4] = (LINEAR_VEL & 0xFF);
  res[5] = res[1];
  res[6] = res[2];
  res[7] = WAIT_DISTANCE;
  res[8] = (distance>> 8) & 0xFF;
  res[9] = (distance& 0xFF);
  /* Stop */
  res[10] = DRIVE;
  res[11] = 0;
  res[12] = 0;
  res[13] = 0;
  res[14] = 0;
  write(serfd, res, 15);

  usleep(100000);

  res[0] = PLAY_SCRIPT;

  x_i += distance * cos(angle);
  y_i += distance * sin(angle);

  return write(serfd, res, 1);
}

int turnRight(int serfd, int _angle, char *res) {
  usleep(1000000);
  bzero(res, sizeof res);
  res[0] = START;
  res[1] = FULL;
  write(serfd, res, 2);

  usleep(100000);

  res[0] = SCRIPT;
  res[1] = 0x0D;
  res[2] = DRIVE;
  res[3] = (LINEAR_VEL >> 8) & 0xFF;
  res[4] = (LINEAR_VEL & 0xFF);
  res[5] = 0xFF;
  res[6] = 0xFF;
  res[7] = WAIT_ANGLE;
  res[8] = (-_angle >> 8) & 0xFF;
  res[9] = (-_angle & 0xFF);
  angle -= _angle;

  /* Stop */
  res[10] = DRIVE;
  res[11] = 0;
  res[12] = 0;
  res[13] = 0;
  res[14] = 0;
  write(serfd, res, 15);

  usleep(100000);
  
  res[0] = PLAY_SCRIPT;
  return write(serfd, res, 1);
}


int turnLeft(int serfd, int _angle, char *res) {
  usleep(1000000);
  bzero(res, sizeof res);
  res[0] = START;
  res[1] = FULL;
  write(serfd, res, 2);

  usleep(100000);

  res[0] = SCRIPT;
  res[1] = 0x0D;
  res[2] = DRIVE;
  res[3] = (LINEAR_VEL >> 8) & 0xFF;
  res[4] = (LINEAR_VEL & 0xFF);

  res[5] = 0;
  res[6] = 0x01;
  res[7] = WAIT_ANGLE;
  res[8] = (_angle >> 8) & 0xFF;
  res[9] = (_angle & 0xFF);
  angle += _angle;

  /* Stop */
  res[10] = DRIVE;
  res[11] = 0;
  res[12] = 0;
  res[13] = 0;
  res[14] = 0;
  write(serfd, res, 15);

  usleep(100000);
  
  res[0] = PLAY_SCRIPT;
  return write(serfd, res, 1);
}


int main(int argc, char *argv[])
{
  int serfd, serfd2, sockfd, newsockfd, portno, n, ser_n;
  socklen_t clilen;
  struct sockaddr_in serv_addr, cli_addr;
  char buffer[4096];
  char *mbed = "/dev/ttyO2";
  char *irobot = "/dev/ttyO1"; /* UART1; RX P9_26, TX P9_24 */

  char res[MAX_COMMAND];
  char ultrasonic[10];

  /* State variable initialization */
  x_0 = 0; y_0 = 0; x_i = 0; y_i = 0; angle = 0;

  if (argc < 2) {
    fprintf(stderr,"[!] usage %s port\n", argv[0]);
    exit(1);
  }

  // Setup the Serial port
  serfd = open(irobot, O_RDWR | O_NOCTTY | O_SYNC);
  // Setup the Serial port for Mbed
  serfd2 = open(mbed, O_RDWR | O_NOCTTY | O_SYNC);
  if (serfd < 0 )
    error("[!] ERROR opening serial port for Create");
  if (serfd2 < 0)
    error("[!] ERROR opening serial port for Mbed");
  setupSerial(serfd, B57600);
  setupSerial(serfd2, B115200);

  // Setup the socket
  sockfd = socket(AF_INET, SOCK_STREAM, 0);

  if (sockfd < 0) 
    error("[!] ERROR opening socket");

  bzero((char *) &serv_addr, sizeof(serv_addr));
  portno = atoi(argv[1]);
  serv_addr.sin_family = AF_INET;
  serv_addr.sin_addr.s_addr = INADDR_ANY;
  serv_addr.sin_port = htons(portno);

  if (bind(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) < 0) 
    error("[!] ERROR binding socket");

  listen(sockfd,5);
  clilen = sizeof(cli_addr);
  newsockfd = accept(sockfd, (struct sockaddr *) &cli_addr, &clilen);
  if (newsockfd < 0) 
    error("[!] ERROR on accept");

  char command[3];
  int arg[2];
  int distance_travelled = 0;
	int stopped = 1;
  char *ctpr;

  while(1) {
    bzero(buffer,4096);
    bzero(res, sizeof(char) * MAX_COMMAND);
    n = read(newsockfd, buffer, 4096);
    cptr = strstr(buffer, "\r\n\r\n");

    if (cptr)
      cptr += 4; /* move by 4 bytes to pass the \r\n\r\n sequence */

    if (n < 0) error("ERROR reading from socket");

    printf("RECV MSG: %s\n",buffer);
    if (buffer[0] == 'i') {
      /* iRobot command */
      //sscanf(buffer, "%c%c%c %d %d", &command[0], &command[1], &command[2], &arg[0], &arg[1]);
      sscanf(cptr, "%c%c%c %d %d", &command[0], &command[1], &command[2], &arg[0], &arg[1]);
      

      printf("command[0]:%c, command[1]:%c, command[2]:%c, arg[0]:%d, arg[1]:%d\n", command[0], command[1], command[2], arg[0], arg[1]);

      switch (command[1]) {
        case 'd':
        {
          go(serfd, 500, res);
          while (distance_travelled < arg[0] - 200) {
            write(serfd2, "d", 1);
            bzero(ultrasonic, sizeof ultrasonic);
            ser_n = read(serfd2, ultrasonic, sizeof ultrasonic);
            if (ultrasonic[0] == '1') {
                /* There is an obstacle */
                turnRight(serfd, 90, res);
                go(serfd, 300, res);
                turnLeft(serfd, 90, res);
                go(serfd, 700, res);
                turnLeft(serfd, 90, res);
                go(serfd, 300, res);
                turnRight(serfd, 90, res); 
                distance_travelled += 500;          
            } else {
                go(serfd, 200, res);
                distance_travelled += 200;
            }
          }
          //go(serfd, arg[0] - distance_travelled, res);

          printf("command: go straight\n");
          break;
        }
        case 'f':
        {
          res[0] = START;
          res[1] = FULL;
          n = write(serfd, res, 2);

          usleep(100000);

          res[0] = SCRIPT;
          res[1] = 0x0D;
          res[2] = DRIVE;
          res[3] = (LINEAR_VEL >> 8) & 0xFF;
          res[4] = (LINEAR_VEL & 0xFF);
          if (command[2] == 'l') {
            /* Counter-clockwise */
            res[5] = 0;
            res[6] = 0x01;
            res[7] = WAIT_ANGLE;
            res[8] = 0;
            res[9] = 0x5A;

            angle += 90;
          } else if (command[2] == 'r') {
            /* Clockwise */
            res[5] = 0xFF;
            res[6] = 0xFF;
            res[7] = WAIT_ANGLE;
            res[8] = 0xFF;
            res[9] = 0xA6;

            angle -= 90;
          } else {
      	    n = write(newsockfd,"ACK Command not recognized\n",40);
          }
          /* Stop */
          res[10] = DRIVE;
          res[11] = 0;
          res[12] = 0;
          res[13] = 0;
          res[14] = 0;
          n = write(serfd, res, 15);

          usleep(100000);
          
          res[0] = PLAY_SCRIPT;
          n = write(serfd, res, 1);

          printf("command: f\n");
          break;
        }
        case 'p':
        {
          if (command[2] == 'l') {
            /* Counter-clockwise */
            turnLeft(serfd, arg[0], res);
          } else if (command[2] == 'r') {
            /* Clockwise */
            turnRight(serfd, arg[0], res);
          } else {
      	    n = write(newsockfd,"ACK Command not recognized\n",40);
          }
        }
        case 'r':
        {
	        if (command[2] == 's') {
            res[0] = START;
            res[1] = FULL;
            n = write(serfd, res, 2);

            usleep(100000);

            res[0] = SCRIPT;
            res[1] = 0x09;
            res[2] = QUERY_LIST;
            res[3] = 0x07;
            res[4] = 0x01;
            res[5] = 0x02;
            res[6] = 0x04;
            res[7] = 0x27;
            res[8] = 0x28;
            res[9] = 0x29;
            res[10] = 0x2A;

            n = write(serfd, res, 11);

            usleep(100000);

            /* The number of bytes in aggregate sensor data is 48 */
            n = read(serfd, res, 48);

            res[48] = '\n';
            n = write(newsockfd, "ACK Sensor Data Received\n", 25);
            n = write(newsockfd, res, 49);
            
            printf("command:sensor\n");
          } else if (command[2] == 't') {
            res[0] = START;
            res[1] = FULL;
            n = write(serfd, res, 2);

            usleep(100000);

            /* Return to the starting position */
            /* Adjust the orientation */
            res[0] = SCRIPT;
            res[1] = 0x2D;
            res[2] = DRIVE;
            res[3] = (LINEAR_VEL >> 8) & 0xFF;
            res[4] = (LINEAR_VEL & 0xFF);
            if (angle > 0) { // Rotated ccw the last time
              /* Rotate cw to adjust */
              res[5] = 0xFF;
              res[6] = 0xFF;
            } else { // Rotate cw the last time
              /* Rotate ccw to adjust */
              res[5] = 0;
              res[6] = 0x01;
            }
            res[7] = WAIT_ANGLE;
            res[8] = (-angle >> 8) & 0xFF;
            res[9] = (-angle & 0xFF);

            /* Move in the reverse y-directions */
            res[10] = DRIVE;
            if (y_i > 0) {
              res[11] = (-LINEAR_VEL >> 8) & 0xFF;
              res[12] = (-LINEAR_VEL & 0xFF);
            } else {
              res[11] = (LINEAR_VEL >> 8) & 0xFF;
              res[12] = (LINEAR_VEL & 0xFF);
            }
            res[13] = 0x80;
            res[14] = 0;
            res[15] = WAIT_DISTANCE;
            res[16] = (-y_i >> 8) & 0xFF;
            res[17] = (-y_i & 0xFF);
            
            /* Rotate -90 (cw 90) degrees */
            res[18] = DRIVE;
            res[19] = (LINEAR_VEL >> 8) & 0xFF;
            res[20] = (LINEAR_VEL & 0xFF);
            res[21] = 0xFF;
            res[22] = 0xFF;
            res[23] = WAIT_ANGLE;
            res[24] = 0xFF;
            res[25] = 0xA6;
            
            /* Move in the reverse x-direction */
            res[26] = DRIVE;
            if (x_i > 0) {
              res[27] = (-LINEAR_VEL >> 8) & 0xFF;
              res[28] = (-LINEAR_VEL & 0xFF);
            } else {
              res[27] = (LINEAR_VEL >> 8) & 0xFF;
              res[28] = (LINEAR_VEL & 0xFF);
            }
            res[29] = 0x80;
            res[30] = 0;
            res[31] = WAIT_DISTANCE;
            res[32] = (-x_i >> 8) & 0xFF;
            res[33] = (-x_i & 0xFF);

            /* Rotate 90 (ccw 90) degrees to adjust the orientation */
            res[34] = DRIVE;
            res[35] = (LINEAR_VEL >> 8) & 0xFf;
            res[36] = (LINEAR_VEL & 0xFF);
            res[37] = 0;
            res[38] = 0x01;
            res[39] = WAIT_ANGLE;
            res[40] = 0;
            res[41] = 0x5A;

            /* Stop */
            res[42] = DRIVE;
            res[43] = 0;
            res[44] = 0;
            res[45] = 0;
            res[46] = 0;

            n = write(serfd, res, 47);

            usleep(100000);

            res[0] = PLAY_SCRIPT;
            n = write(serfd, res, 1);
            
            x_i = 0; y_i = 0; angle = 0;
            printf("command: ret\n");
          } else if (command[2] == 'e') {
            x_0 = arg[0];
            y_0 = arg[1];
            x_i = x_i - x_0; 
            y_i = y_i - y_0;
            printf("command: reset\n");
          }
          break;
        } 
        case 'g':
        {
          go(serfd, arg[1], res);
          turnRight(serfd, 90, res);
          go(serfd, arg[0], res);
          turnLeft(serfd, 90, res);

          x_i += arg[0]; y_i += arg[1];

          printf("command: goto\n");
          break;
        }
        default:
        {
          break;
        }
      }
      n = write(newsockfd,"ACK command received\n",20);
    } else if (buffer[0] == 'G' && buffer[1] == 'E' && buffer[2] == 'T') {
      if (stopped) {
  //      while (1) {
          go(serfd, 500, res);
          turnLeft(serfd, 90, res);
          go(serfd, 500, res);
          turnLeft(serfd, 90, res);
          go(serfd, 500, res);
          turnLeft(serfd, 90, res);
          go(serfd, 500, res);
          turnLeft(serfd, 90, res);
  //      }
      } else {
        stop(serfd, res);
      }
	  } else {
      /* Mbed commands */
      if (buffer[0] == 's') {
        n = write(newsockfd,"ACK start scanning\n",20);
        write(serfd2, "s", 1);
      } else if (buffer[0] == 't') {
        n = write(newsockfd,"ACK stop scanning\n",20);
        write(serfd2, "t", 1);
      } else if (buffer[0] == 'h') {
        n = write(newsockfd,"ACK scan at heading\n",20);
        write(serfd2, buffer, 6);
      } else if (buffer[0] == 'd') {
        write(serfd2, "d", 1);
        bzero(ultrasonic, 10);
        ser_n = read(serfd2, ultrasonic, sizeof ultrasonic);
        write(newsockfd, "ACK send data\n", 30);
        if (ser_n < 0)
          error("[!] ERROR failed to read serial port");
        printf("read %d bytes from serial port message = %s\n", ser_n, buffer);
        n = write(newsockfd, ultrasonic, sizeof ultrasonic);
      } else {
        n = write(newsockfd,"ACK Command not recognized\n",40);
      }
    }

    if (n < 0) error("[!] ERROR writing to socket");
  }

  close(newsockfd);
  close(sockfd);
  return 0; 
}
