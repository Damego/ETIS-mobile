import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";

import { GLOBAL_STYLES } from "../../styles/styles";

import Header from "../../components/Header";
import { vars } from "../../utils/vars";
import LoadingPage from "../../components/LoadingPage";
import Trimester from "./trimester";

const getTeachPlan = async () => {
  let html = await vars.httpClient.getTeachPlan();
  if (!html) {
    return;
  }
  return vars.parser.parseTeachPlan(html);
};

const ShortTeachPlan = () => {
  const [data, setData] = useState();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      let data = await getTeachPlan();
      if (!data) {
        return console.warn("cannot load teach plan");
      }
      setLoaded(true);
      setData(data);
    };
    wrapper();
  });

  if (!isLoaded || !data) return <LoadingPage />;
  console.log(data);
  return (
    <ScrollView>
      <View style={GLOBAL_STYLES.screen}>
        <Header text={"Учебный план"} />
        {data.map((trimester) => (
          <Trimester data={trimester} key={data.indexOf(trimester)} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ShortTeachPlan;
