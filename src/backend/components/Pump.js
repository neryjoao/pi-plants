const Relay = require('johnny-five').Relay;

module.exports = class Pump  extends Relay {
    constructor(five, pumpPin) {
        super(pumpPin)
        this.isOn = false;
        this.close();
    }

    toggleWater = () => {
        if (this.isOn) {
            this.close();
            this.isOn = false;
        } else {
            this.open();
            this.isOn = true;
        }
        return this.isOn;
    }
    //
    // get isOn () {
    //     return this.isOn;
    // }
    //
    // set isOn (updatedIsOn) {
    //     this.isOn = updatedIsOn
    // }
}
