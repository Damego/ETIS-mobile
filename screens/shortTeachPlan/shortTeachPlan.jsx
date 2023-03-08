import React, { useState, useEffect } from "react";

import { vars } from "../../utils/vars";
import LoadingPage from "../../components/LoadingPage";
import Trimester from "./trimester";
import Card from "../../components/Card";
import Screen from "../../components/Screen";

const getTeachPlan = async () => {
  let html = await vars.httpClient.getTeachPlan();
  if (!html) {
    return;
  }
  return vars.parser.parseTeachPlan(html);
};

const ShortTeachPlan = () => {
  const [data, setData] = useState(null);
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

  return (
    <Screen headerText={"Учебный план"}>
      {data.map((trimester, index) => (
        <Card
          topText={trimester.trimester}
          component={<Trimester data={trimester} key={"t" + index} />}
          key={"c" + index}
        />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
