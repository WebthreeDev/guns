const lastForWallet = (wallet) => {
    const length = wallet.length
    const str2 = wallet.substr(length - 4, 4);
    const result = str2;
    return result
}
export default lastForWallet