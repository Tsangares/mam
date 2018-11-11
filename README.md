# MAM
This is a simple demostration of the Masked Authenticated Messaging protocol which runs on top of the IOTA tangle.

In this project we use a Raspberry pi connected with an HCSR04 ultrasonic sensor. The mam_sensor.js is responsible for periodically reading the sensor data and publishing it to the IOTA tangle. mam_receive.js is an example of how we could subscribe these messages. 
