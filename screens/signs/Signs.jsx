import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";

import { vars } from "../../utils/vars";
import LoadingPage from "../../components/LoadingPage";
import Subject from "./Subject";
import { GLOBAL_STYLES } from "../../styles/styles";
import Header from "../../components/Header";
import Card from "../../components/Card";

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
    <ScrollView>
      <View style={GLOBAL_STYLES.screen}>
        <Header text={"Оценки"} />
        {data.map((subject) => {
          return <Card topText={subject.subject} component={<Subject data={subject}/>} key={data.indexOf(subject)}/>;
        })}
      </View>
    </ScrollView>
  );
};

export default Signs;
