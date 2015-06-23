# barcode-scanner-poc
Spring Boot - Angular / Code128-QR code reader

This is a QR code reader/writer and a Code128 reader webapp.  The QR codes are generated with qrgen (via servlet)

The QR code and code128 readers are implemented with ZXing and Quagga, respectively.

A Spring boot .jar application hosts the webapp.  To run it, execute mvn spring-boot:run
