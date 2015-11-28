package com.example.chen.saphire;

/**
 * Created by Hyeonsu Kang on 2015-11-27.
 */

/* importing the libraries for socket.io-java-client */
import android.net.Uri;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/* importing the JSON libraries */
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

public class SaphireClient {
    private Socket socket;

    public SaphireClient() throws Exception {
        String serverUri = "http://ec2-52-25-254-206.us-west-2.compute.amazonaws.com:4200";
        try {
            socket = IO.socket(serverUri);
            socket.on(Socket.EVENT_CONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    socket.emit("simulate", "microwave:start");
                    socket.disconnect();
                }
            }).on("event", new Emitter.Listener() {
                @Override
                public void call(Object... args) {

                }
            }).on(Socket.EVENT_DISCONNECT, new Emitter.Listener() {
                @Override
                public void call(Object... args) {

                }
            });
            socket.connect();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

    }
}
