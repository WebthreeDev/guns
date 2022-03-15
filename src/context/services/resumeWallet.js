const resumeWallet = (wallet) => {
    let str1 = wallet.substr(0, 4);
    const length = wallet.length
    const str2 = wallet.substr(length - 4, 4);
    const result = str1 + "..." + str2;
    return result
}
export default resumeWallet