import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {AuthPage} from "../screens/Auth";
import TabNavigator from "../components/TabNavigation";

import { vars } from "../utils/vars";

const Stack = createNativeStackNavigator();

export const StackNavigator = (isSignedIn, setSignedIn) => {
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
          {!isSignedIn ? (
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
                <AuthPage {...props} onSignIn={() => (setSignedIn = true)} />
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
