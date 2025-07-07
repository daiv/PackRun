import { Amplify } from "aws-amplify";
import '@aws-amplify/react-native';

const amplifyConfig = {
  Auth: {

    Cognito: {
      userPoolId: "eu-north-1_S29aYSOiO", // Your User Pool ID
      userPoolClientId: "57c1iqk9ge04q7jfeodto9j3jr", // Your App Client ID
      region: "eu-north-1", // Your AWS Region 
    }
  }
}

Amplify.configure(amplifyConfig);