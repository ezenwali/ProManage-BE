export const sendOtpMessage = (code: string) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:500px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Pro-Manage</a>
  </div>
  <p style="font-size:1.1em">Hi,</p>
  <p>Thank you for choosing Pro-Manage. Use the following OTP to complete your Sign Up procedures. OTP is valid for 30 minutes</p>
  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
  <p style="font-size:0.9em;">Regards,<br />Pro-Manage</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:left;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Pro-Manage</p>
    <p>129 Surrey</p>
    <p>British Colombia</p>
  </div>
</div>
</div>`;
};

export const sendWelcomeEmailMessage = (name?: string) => {
  return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:500px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Pro-Manage</a>
  </div>
  <p style="font-size:1.1em">Hi, ${name ? name : 'there'}</p>
  <p>Welcome aboard! We're thrilled to have you join our community. Feel free to explore and make yourself at home. If you have any questions or need assistance, don't hesitate to reach out. We're here to help and support you on your journey with us.</p>
  <p style="font-size:0.9em;">Regards,<br />Pro-Manage</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:left;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    <p>Pro-Manage</p>
    <p>129 Surrey</p>
    <p>British Colombia</p>
  </div>
</div>
</div>`;
};
