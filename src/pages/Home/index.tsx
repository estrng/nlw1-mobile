import React, { useEffect, useState, ChangeEvent } from "react";
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Text,
  Platform,
  Alert,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { externalApi } from "../../services/api";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState("0");
  const [city, setCity] = useState("0");
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    externalApi.get<IBGEUFResponse[]>("/").then((res) => {
      const ufInitials = res.data.map((uf) => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (!uf) {
      return;
    }

    externalApi
      .get<IBGECityResponse[]>(`/${uf}/distritos?orderBy=nome`)
      .then((res) => {
        const cityNames = res.data.map((city) => city.nome);
        const filteredCityNames = cityNames.filter(
          (city, index) => cityNames.indexOf(city) === index
        );
        setCities(filteredCityNames);
      });
  }, [uf]);

  function handleNavigateToPoints() {
    if (!uf || !city) {
      Alert.alert(
        "Falha na busca",
        "Você precisa selecionar uma UF e uma cidade"
      );
      return;
    }
    navigation.navigate("Points", { uf, city });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <Text style={styles.title}>Seu marketplace de coleta.</Text>
          <Text style={styles.description}>
            Estamos tantando conectar as pessoas com lugares que fazem coleta de
            resísduos.
          </Text>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{ label: "Selecione a UF" }}
            style={{ inputAndroid: styles.picker }}
            onValueChange={(value) => setUf(value)}
            useNativeAndroidPickerStyle={false}
            items={ufs.map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />

          <RNPickerSelect
            placeholder={{ label: "Selecione a cidade" }}
            style={{ inputAndroid: styles.picker }}
            onValueChange={(value) => setCity(value)}
            useNativeAndroidPickerStyle={false}
            items={cities.map((item) => {
              return {
                label: item,
                value: item,
              };
            })}
          />

          <RectButton
            style={styles.button}
            onPress={() => {
              handleNavigateToPoints();
            }}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
  picker: {
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
});

export default Home;
