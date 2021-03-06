import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import axios from "../../axios/axios";
import { Alert } from "@material-ui/lab";
import {
  sendEvent,
  FIREBASE_REPORT_CREATED,
  FIREBASE_REPORT_ERROR,
} from "../../util/analytics";
import { useHistory } from "react-router-dom";

const OtpModal = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<any>("");
  const [otpError, setOtpError] = useState<string>("");
  const history = useHistory();

  return (
    <Dialog
      style={{
        zIndex: 9000,
      }}
      open={props.visible}
    >
      <DialogTitle>Phone number verification </DialogTitle>
      <DialogContent>
        {otpError && (
          <Alert variant="filled" severity="error">
            {otpError}
          </Alert>
        )}
        <DialogContentText>
          Enter the 6 digit OTP sent to your phone / OTP दर्ज करें
        </DialogContentText>
        <TextField
          type="number"
          autoFocus
          placeholder="Enter the 6 digit OTP"
          variant="outlined"
          value={otp}
          disabled={loading}
          fullWidth
          onChange={(event: any) => {
            setOtp(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={loading}
          onClick={() => {
            if (otp.length !== 6) {
              setOtpError("OTP length should be 6 digits");
              return;
            }
            setLoading(true);
            const formData = new FormData();
            console.log(otp);
            formData.append("otp", otp);
            axios
              .post(`/helper/verify`, formData)
              .then(response => {
                console.log("response", response);
                if (response.data.error === 0) {
                  sendEvent(FIREBASE_REPORT_CREATED);
                  props.getData();
                  props.setSuccessMessage(
                    "Phone number verified. Report submitted successfully!"
                  );
                  props.setOtpModal(false);
                  setTimeout(() => {
                    history.replace("/home");
                  }, 3000);
                } else {
                  setOtpError("There was an error");
                }
              })
              .catch(error => {
                console.log(error);
                setOtpError("There was an error");
                sendEvent(FIREBASE_REPORT_ERROR, error);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OtpModal;
