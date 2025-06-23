import { Amplify } from "aws-amplify";
import '@aws-amplify/react-native';

const amplifyConfig = {
  Auth: {

    Cognito: {
      userPoolId: "eu-north-1_RqnVqAHxb", // Your User Pool ID
      userPoolClientId: "1a492i6mgl4vgj6n3ugs1c6v5q", // Your App Client ID
      region: "eu-north-1", // Your AWS Region 
    }
  }
}

Amplify.configure(amplifyConfig);