#include <SPI.h>
#include <Ethernet2.h>
#include <DHT.h>
#include "ethernet.h"


#define DHTPIN 2
#define DHTTYPE DHT21


DHT dht(DHTPIN, DHTTYPE);

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
IPAddress ip(192, 168, 1, 49);

EthernetServer server(80);

Temperature temperature = Temperature(&dht, 6);
Humidity humidity = Humidity(&dht, 5);
Light light = Light(6, 36);

Property* properties[] = {&temperature, &humidity, &light};

Room kuhinja = Room(String("Kuhinja"), properties);

Room arr[1] = {kuhinja};

RequestHandler requestHandler = RequestHandler(arr, 1);


void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;
  }
  
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP.");
    Ethernet.begin(mac, ip);
  }
  
  server.begin();
  Serial.print("Server is at: ");
  Serial.println(Ethernet.localIP());
  
  dht.begin();
}


void loop() {
  EthernetClient client = server.available();
  String http = String();
  bool firstSpace = false;
  bool valid = true;
  
  if (client) {
    Serial.println("Client connected\n");
    Serial.println();
    
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        if(firstSpace && c == ' ') {
          valid = false;

          int spaceIndex = http.indexOf(' ');
          String method = http.substring(0, spaceIndex);
          String path = http.substring(spaceIndex+1);

          Serial.println("Request:\nMethod: " + method + "\nPath: " + path);

          String response = requestHandler.handleRequest(method, path);
          client.print(response);

          Serial.println("\nResponse:\n" + response + "\n");

          break;
        }
        if(c == ' ') {
          firstSpace = true;
        }
        if(valid) {
          http.concat(c);
        }
      }
    }

    delay(1);
    client.stop();
    Serial.println("Client disconnected\n");
  }
}
