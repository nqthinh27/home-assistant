import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
} from "react-native";
import Colors from "../constants/colors";
import { styles } from "../components/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { userKey } from "../constants/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../../utils/commonRequest";
import useStore from "../../utils/store";

export default function Home() {
    //navigation
    const navigation = useNavigation();
    //function of navigate 
    const { navigate, goBack, replace } = navigation;
    /**
     * check authen
     */
    const { currentUser, setCurrentUser, removeCurrentUser, entityId, setEntityId } = useStore();
    const [isLoading, setIsLoading] = React.useState(true);
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                const user = await AsyncStorage.getItem(userKey);
                if (user !== null) {
                    var parsedUser = JSON.parse(user);
                    setCurrentUser(JSON.parse(user));
                    const allDevices = await getData('/api/states', parsedUser.token);
                    var existingName = []
                    var filteredData = []
                    allDevices.forEach(item => {
                        if (item.attributes.friendly_name.slice(0, 2) == '0x') {
                            const name = item.attributes.friendly_name.slice(0, 18);
                            if (existingName.length === 0) {
                                console.log("====" + name);
                                existingName.push(name)
                                filteredData.push(item);
                            } else {
                                let existingGroup = existingName.find(groupName => groupName === name);
                                if (existingGroup) {
                                    console.log("====" + name);
                                    // existingGroup.devices.push(item);
                                } else {
                                    console.log("====" + name);
                                    existingName.push(name)
                                    filteredData.push(item);
                                }
                            }
                        }
                    });
                    // const filteredData = allDevices.reduce((acc, item) => {
                    //     if (item && item.attributes && item.attributes.friendly_name) {
                    //         const name = item?.attributes?.friendly_name?.split(' ')[0];
                    //         const existingGroup = acc.find(group => group[0].attributes.friendly_name === name);
                    //         if (existingGroup) {
                    //             existingGroup.push(item);
                    //         } else {
                    //             acc.push([item]);
                    //         }
                    //         return acc;
                    //     }
                    // }, []);
                    // console.log(filteredData);
                    setDevices(filteredData);
                } else {
                    replace('Login');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        checkCurrentUser();
    }, []);
    /**
     * handle pick 1 device
     * @param {*} id 
     */
    const handleDetail = (entityId) => {
        console.log(entityId);
        setEntityId(entityId);
        navigate('DeviceDetail');
    }
    return (
        <SafeAreaView style={[styles.customSafeArea]}>
            <ScrollView style={styles.container}>
                <Text style={styles.headerText}>Tất cả thiết bị</Text>
                <View style={homeCss.container}>
                    {devices.map((item, index) => {
                        return (
                            <TouchableOpacity style={homeCss.item} key={index} onPress={() => handleDetail(item.attributes.friendly_name.slice(0, 18))}>
                                <Text style={homeCss.itemTitle}>{item.attributes.friendly_name.slice(0, 18)}</Text>
                                <View style={homeCss.itemIcon}>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const homeCss = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    item: {
        width: Dimensions.get("window").width / 2 - 24,
        height: 150,
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 10,
        marginBottom: 16,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.03,
        shadowRadius: 3.84,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    itemDesc: {
        fontSize: 14,
    },
    itemIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    itemIconText: {
        fontSize: 20,
        fontWeight: "600",
    },
    itemImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    itemIconTextSmall: {
        fontSize: 14,
    }
})