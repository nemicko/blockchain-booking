const ec = require('elliptic').ec;
const EC = new ec('secp256k1');

const generatePrivatekey = function (){
    const keyPair = EC.genKeyPair({pers: "testtest"});
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);

};
const initWallet = function(){

    const newPrivateKey = generatePrivatekey();
    console.log(newPrivateKey);


};
 // initWallet();
