const generateOtp = () => {
  let otpNumber ="1234567890";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * otpNumber.length);
    console.log(randomIndex, otpNumber.length);

    otp += randomIndex;
  }
  return otp;
};

export default generateOtp;
