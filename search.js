import tonMnemonic from "tonweb-mnemonic";
import TonWeb from "tonweb";
import axios from "axios";

// SETTINGS:
const letters = ['-croak', '-vibe', '-ton']
const threads = 3
// CHAT ID https://t.me/userinfobot
const chat_id = '' // ex: '1351881907'
// BOT API TOKEN https://t.me/botfather
const bot_api = '' // ex: '222222221:AAHzxczzc3t3T545213KswnI41235231ocI'
// Wallet type
const wallet_type = 'v4R2'
//

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));
const WalletClass = tonweb.wallet.all[wallet_type];

async function getNewAddress() {
    const mnemonic = await tonMnemonic.generateMnemonic()
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });
    const walletAddress = await wallet.getAddress();
    const addr = walletAddress.toString(true, true, true)
    return {'seed': mnemonic, 'address': addr}
}

let i = 0;
let process = true

async function try_again() {
    if (!process) return 0;
    i++
    await getNewAddress().then(data => {
        let good = false
        let letter = ''
        let position = ''
        console.log(i + '. ' + data.address)
        letters.forEach(l => {
            let k = data.address.toLowerCase().substr(-l.length).indexOf(l);
            if (k != -1) {
                good = true
                letter = l
                position = k
            }
        })
        if (good) {
            console.log(data.seed.join(' '))
            console.log('pos: ' + position, 'word: ' + letter)
            console.log(data.address)
            let message = '<b>New Data</b>' +
                '\n\n' +
                '<b>word: ' + letter + '</b>' +
                '\n\n' +
                '<i>! </i><span class="tg-spoiler">' + data.seed.join(' ') + '</span>' +
                '\n\n' +
                '<i>address: ' + data.address + '</i>';
            axios
                .get('https://api.telegram.org/bot' + bot_api + '/sendmessage?chat_id=' + chat_id + '&text=' + encodeURI(message) + '&parse_mode=html')

            // UNCOMMENT TO STOP WHEN FOUND
            // process = false
        }

        try_again()

    });
}

for (let j = 0; j <= threads; j++) await try_again()