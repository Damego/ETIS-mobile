import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from "../screens/Auth";

import TabNavigator from "./TabNavigation";

import { vars } from "../utils/vars";

const Stack = createNativeStackNavigator();

const StackNavigator = (isSignedIn, setSignedIn) => {
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