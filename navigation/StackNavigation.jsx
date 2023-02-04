import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from "../screens/Auth";

import TabNavigator from "./TabNavigation";

const Stack = createNativeStackNavigator();

const StackNavigator = ({isSignedIn, setSignedIn}) => {
  console.log("signed in ", isSignedIn);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: "#FFFFFF",
            },
          }}
        >
          {
          !isSignedIn ? (
            <Stack.Screen
              name="Authorization"
              options={{ headerShown: false }}
              screenOptions={{
                contentStyle: {
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              {(props) => (
                <AuthPage onSignIn={() => (setSignedIn(true))} />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="Navigator"
              options={{ headerShown: false }}
              screenOptions={{
                contentStyle: {
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              {(props) => <TabNavigator {...props} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default StackNavigator;