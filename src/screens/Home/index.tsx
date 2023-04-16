import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Header } from "../../components/Header";
import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
  Container,
  Metadata,
  Title,
  TotalPassCount,
  LoginList,
} from "./styles";

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    const dataKey = "@savepass:logins";

    const response = await AsyncStorage.getItem(dataKey);

    const data = JSON.parse(response as string);

    setSearchListData(data);

    setData(data);
  }

  function handleFilterLoginData() {
    if (searchText.length < 1) {
      return setSearchListData(data);
    }

    const filteredLogins = data.filter(
      (login) =>
        login.service_name.toLowerCase().includes(searchText?.toLowerCase()) ||
        login.email.toLowerCase().includes(searchText?.toLowerCase())
    );

    return setSearchListData(filteredLogins);
  }

  function handleChangeInputText(text: string) {
    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <>
      <Header
        user={{
          name: "Gustavo",
          avatar_url:
            "https://media.licdn.com/dms/image/D4D03AQEfR0s4QrG2ZQ/profile-displayphoto-shrink_400_400/0/1668364618416?e=1686787200&v=beta&t=Ht9kk3OcW98uKssoeQ4X8euVvZ2UFh6bJ3ef4c2V0l4",
        }}
      />
      <Container>
        <SearchBar
          placeholder="Qual senha você procura?"
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType="search"
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, "0")} ao total`
              : "Nada a ser exibido"}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginDataItem
                service_name={loginData.service_name}
                email={loginData.email}
                password={loginData.password}
              />
            );
          }}
        />
      </Container>
    </>
  );
}
