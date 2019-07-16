const SerialPort = require('serialport');
const COM = require('../config');
const moment = require('moment');
const InterByteTimeout = require('@serialport/parser-inter-byte-timeout')


module.exports = ((app) => {

    // RFID device, mounting and peripherals has been succesfully installed in DE22. As of now, we didn't encountered any problem in reading the CC. Thanks to the support and initiative of our XYZ technicians, Rica, Mfg sups and Engineers.. Further testing will be done offline. Initially, no need for additional tool time.
    
    // invoke.
    connectSerial();

    /** Function to listen in Serial PORT based from the config file... */
    function connectSerial(){
        let port = new SerialPort(COM.serial_path.name, COM.serial_options, (err) => {

            if(err){
                console.log(moment(new Date()).format() + ', ' + 'COM path is undefined or currently using by other application...');
                console.log(moment(new Date()).format() + ', ' + 'Reconnecting...');

                // reconnect...
                reConnectSerial();
            } else {
                console.log(moment(new Date()).format() + ', ' + 'Device connected.');
            }
        });

        function RFID_check_VER(){
            return new Promise((resolve, reject) => {
                port.write('5645520D','hex', (err) => {
                    if(err){reject(err)}
                    resolve('VER');
                });
            });
        }

        function RFID_change_CN_to_1(){
            return new Promise((resolve, reject) => {
                port.write('434E20310D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('CN 1');
                })
            })
        }

        function RFID_change_CID_to_1(){
            return new Promise((resolve, reject) => {
                port.write('43494420310D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('CID 1')
                })
            })
        }

        function RFID_change_MD_to_0(){
            return new Promise((resolve, reject) => {
                port.write('4D4430200D','hex', (err) => {
                    if(err){reject(err)}
                    resolve('MD0');
                });
            });
        }

        function RFID_get_tag(){
            return new Promise((resolve, reject) => {
                port.write('47540D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('GT');
                })
            })
        }

        function RFID_antenna_MP1(){
            return new Promise((resolve, reject) => {
                port.write('4D50310D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP1');
                })
            })
        }

        function RFID_antenna_MP2(){
            return new Promise((resolve, reject) => {
                port.write('4D50320D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP2');
                })
            })
        }

        function RFID_antenna_MP3(){
            return new Promise((resolve, reject) => {
                port.write('4D50330D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP3');
                })
            })
        }

        function RFID_antenna_MP4(){
            return new Promise((resolve, reject) => {
                port.write('4D50340D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP4');
                })
            })
        }

        function RFID_antenna_MP5(){
            return new Promise((resolve, reject) => {
                port.write('4D50350D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP5');
                })
            })
        }

        function RFID_antenna_MP6(){
            return new Promise((resolve, reject) => {
                port.write('4D50360D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP6');
                })
            })
        }

        function RFID_antenna_MP7(){
            return new Promise((resolve, reject) => {
                port.write('4D50370D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP7');
                })
            })
        }

        function RFID_antenna_MP8(){
            return new Promise((resolve, reject) => {
                port.write('4D50380D', 'hex', (err) => {
                    if(err){reject(err)}
                    resolve('MP8');
                })
            })
        }

            

        /** Initialize write... */
        port.open((err) => {

            console.log('port is open...');

            /**  
             *   hex Command Table
             * 
             *   --config---
             *   
             *   VER - 5645520D
             *   MD 0 - 4D4430200D - DON'T NEED IT
             *   CN 1 - 434E20310D
             *   CID 1- 43494420310D
             *   GT - 47540D
             *   
             *   --changing antenna channels---
             * 
             *   MP1 - 4D50310D
             *   MP2 - 4D50320D
             *   MP3 - 4D50330D
             *   MP4 - 4D50340D
             *   MP5 - 4D50350D
             *   MP6 - 4D50360D
             *   MP7 - 4D50370D
             *   MP8 - 4D50380D
             * 
            */

            setTimeout(RFID_check_VER, 1500);
            setTimeout(RFID_change_CN_to_1, 2500);
            setTimeout(RFID_change_CID_to_1, 3500);
            setTimeout(RFID_change_MD_to_0, 4500);

            function Interval_Antenna_RFID_Reading(){
                setTimeout(RFID_antenna_MP1, 1000);
                setTimeout(RFID_antenna_MP2, 2000);
                setTimeout(RFID_antenna_MP3, 3000);
                setTimeout(RFID_antenna_MP4, 4000);
                setTimeout(RFID_antenna_MP5, 5000);
                setTimeout(RFID_antenna_MP6, 6000);
                setTimeout(RFID_antenna_MP7, 7000);
                setTimeout(RFID_antenna_MP8, 8000);
            }

            setInterval(Interval_Antenna_RFID_Reading, 9000);

        });

        let parser = port.pipe(new InterByteTimeout({ interval: 30 }));

        /** data listener */
        parser.on('data', (data) => {
            // console muna.. later tayo mag fs write to file. :p
            let response = data.toString('utf8');
            console.log(response)
            
        });

        /** com port when close listener */
        port.on('close', () => {
            // console muna later tayo mag create ng "close" logs
            console.log(moment(new Date()).format() + ', ' + 'Device disconnected. Trying to reconnect...');
            
            // call reConnectSerial
            reConnectSerial();
        });

        /** com port when error listener */
        parser.on('error', (err) => {
            // console muna, error logs later.
            console.log(err.message);
            console.log(moment(new Date()).format() + ', ' + 'Error occured. Trying to reconnect...');

            reConnectSerial();
        });

    }
    
    /** Function to reconnect back to the listeners. */
    function reConnectSerial(){
        setTimeout(() => {
            // call connectSerial every 10 sec
            connectSerial();
        }, 10000);
    }

});