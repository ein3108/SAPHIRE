# SAPHIRE: Semantic semi-Autonomous Processing Household repertoIRE

## Features

* Natural Language Voice Command Interpreter (To be added in the next version)

* API for Smart House Device Control & POC with Philips HUE (To be added in the next version)

* Various Smart House Device Models & Visual Simulations

* Google Glass Application for QR Code Reading

* Google Glass Application for User Interaction & Notifications

* An Object-Device-Instruction (ODI) Model

* Database Connection with MongoDb

* Connecting the iRobot to SAPHIRE

* The SAPHIRE Server System and Visualization & Tracking of Household Resources (To be added in the next version)

## Releases
* [v 1.0](https://github.com/WeibelLab-Teaching/cse118-218-fa15_Team11) - Initial version of SAPHIRE includes a smart microwave model and a simple Google Glass App that understands pre-defined user voice commands

## Dependencies and Reference guides

* [Npm](http://www.npmjs.com/)
* [Semantic UI](http://semantic-ui.com/)
* [MongoDB](https://www.mongodb.org/)
* [node.js](https://nodejs.org/en/)
* [Express](http://expressjs.com/)
* [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
* [Google Glass API](https://developers.google.com/glass/develop/gdk/voice)


## Setup

Follow the following setup procedures to install the SAPHIRE server system for development (items in the list are presented in out of order).

1. Node.js & node-legacy
  ```
  sudo apt-get update
  sudo apt-get install nodejs
  sudo apt-get install nodejs-legacy
  ```

1. NPM
  ```
  yum install npm
  ```

1. Express-generator (environment-global installation)

  ```
  npm install -g express-generator
  ```

1. Elastic Beanstalk (EB, with command line interface)
  ```
  pip install awsebcli
  cd /to/your/project/folder & eb init
  eb create
  (developement)
  eb deploy
  ```

1. Install Semantic UI
  ```
  npm install semantic-ui --save
  cd semantic/
  gulp build
  ```

1. Installing all other dependencies specified in `package.json`, `cd` into the project folder where the json file is and try the following (necessary for using Express):
  ```
  npm install
  ```

| Option                   | Default value           | Notes                                                                                                     |
|--------------------------|-------------------------|-----------------------------------------------------------------------------------------------------------|
| Amazon Elastic Beanstalk |                         | **(Not Required)** (You can use other server deployment frameworks like Heroku or Microsoft Azure as well.) For Amazon Elastic Beanstalk, create an account for Amazon AWS and make an application deployment machine from Amazon Elastic Beanstalk |
| Google Glass SDK |                 | **(Required)**                  |

## Common issues & Troubleshooting

1. If you're building this server system on top of a virtual machine or Amazon EC2 where the amount of free disk space is limited, there's a chance that MongoDB will fail to execute with the following message:

  * ERROR: Insufficient free space for journal files *

  In order to get around this, unless you can add extra disk space to your system, try to configure MongoDB differently with 
  ```
  storage:
    smallFiles: true
  ```

  Then execute `mongod` with the new configuration file: `mongod -f /etc/mongodb.conf`

  Providing a command line option is also possible, for example,
  ```
  mongod --dbpath /data/db --smallfiles
  ```

  For more information, please visit [MongoDB Documentation](https://docs.mongodb.org/manual/reference/configuration-options/#storage.mmapv1.smallFiles)

1. Can't connect to Google Glass using ADB on Windows
  If Glass is not listed in the connected device panel, please try the following:
  1. Use task manager to kill adb.exe and run adb.exe again.
  1. Instal the Android Composite ADB Interface for the detected *unknown* device:
    - Go to Control Panel -> System -> Device Manager -> Other Devices -> Glass 1 -> Update Driver. Then browse your computer to locate the android_winusb.inf file under the adt-bundle-windows-*\sdk\extras\google\usb_driver


## Bug fixes and pull requests

Notice a bug or want to add a feature? [Open an issue](https://github.com/WeibelLab-Teaching/cse118-218-fa15_Team11/issues) or submit a pull request like so:

1. Fork the project.
1. Make your feature addition or bug fix.
1. Commit and send me a pull request.

## Useful Command Line Hacks

1. To view a list of recently installed packages (via all different kinds of installation methods e.g. apt-get, yum, etc)
  ```
  cat /var/log/dpkg.log | grep "\ install\ "
  ```

2. To check on which port is the database (MongoDB) is listening:
  ```
  sudo lsof -iTCP -sTCP:LISTEN | gerp mongo
  ```

## Contributors 

* [Hyeonsu Kang](https://www.linkedin.com/pub/hyeonsu-kang/93/28b/684)

* [Chen-hao Liao](https://github.com/Chenhaoxd)

* [Dewey Martin Nguwen](https://github.com/martininguyen)

* [Pargat Singh](https://github.com/gotsingh)

## Copyright and attribution

Copyright (c) 2015 Hyeonsu Kang. Released under the MIT License.

If you use this template, please provide the following attribution in the footer: 

```html
<a href='https://github.com/WeibelLab-Teaching/cse118-218-fa15_Team11'>SAPHIRE</a> 
by <a href='http://github.com/WeibelLab-Teaching/cse118-218-fa15_Team11'>Team11</a>.
```
