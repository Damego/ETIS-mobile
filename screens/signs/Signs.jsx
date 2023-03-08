import React, { useState, useEffect } from "react";

import { vars } from "../../utils/vars";
import LoadingPage from "../../components/LoadingPage";
import Subject from "./Subject";
import Card from "../../components/Card";
import Screen from "../../components/Screen";

const Signs = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      let html = await vars.httpClient.getSigns("current");
      if (vars.parser.isLoginPage(html)) return;

      let data = vars.parser.parseSigns(html);
      setLoaded(true);
      setData(data);
    };
    wrapper();
  });

  if (!isLoaded || !data) return <LoadingPage />;

  return (
    <Screen headerText={"Оценки"}>
      {data.map((subject) => {
        return (
          <Card
            topText={subject.subject}
            component={<Subject data={subject} />}
            key={data.indexOf(subject)}
          />
        );
      })}
    </Screen>
  );
};

export default Signs;
