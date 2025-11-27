import { PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, } from "./AuthContext";
import { ConnProvider, } from "./ConnContext";
import { RunProvider, } from "./RunContext";

export function Providers({ children }: PropsWithChildren) {
  const providers = [
    AuthProvider,
    ConnProvider,
    RunProvider,
    SafeAreaProvider];

  return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

}