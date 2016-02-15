'use strict';

class Cow {
  static setToken(str){
    this._token = str;
  }
}

class Herd {

}

module.exports = {
  Cow: Cow, Herd: Herd
}
