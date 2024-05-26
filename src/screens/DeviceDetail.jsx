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
    Switch,
    Modal,
    Button,
} from "react-native";
import { styles } from "../components/GlobalStyles";
import colors from "../constants/colors";
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { device } from "../../utils/device";
import { oneHundredElement } from "../constants/common";
import { switchColor } from "../constants/switchColor";
import useStore from "../../utils/store";
import { getData, postData } from "../../utils/commonRequest";

export default function DeviceDetail(props) {
    //navigation
    const navigation = useNavigation();
    //function of navigate 
    const { navigate, goBack } = navigation;
    const [switchStatus, setSwitchStatus] = useState(true);
    const [powerOnBehavior, setPowerOnBehavior] = useState('On');
    const [modalPowerOnBehavior, setModalPowerOnBehavior] = useState(false);
    const handleOnBehaviorPress = (value) => {
        setPowerOnBehavior(value);
        setModalPowerOnBehavior(false);
    };
    const handleChangeSwitchStatus = async () => {
        if (switchStatus) {
            const result = await postData(`/api/services/switch/turn_off`, { entity_id: entityId }, currentUser.token);
        } else {
            const result = await postData(`/api/services/switch/turn_on`, { entity_id: entityId }, currentUser.token);
        }
        setSwitchStatus(!switchStatus);
    }

    const [indicatorMode, setIndicatorMode] = useState('None');
    const [modalIndicatorMode, setModalIndicatorMode] = useState(false);
    const handleIndicatorModePress = (value) => {
        setIndicatorMode(value);
        setModalIndicatorMode(false);
    };

    const [brightness, setBrightness] = useState(0);
    const [modalBrightness, setModalBrightness] = useState(false);
    const handleBrightnessPress = (value) => {
        setBrightness(value);
        setModalBrightness(false);
    };

    const [onColor, setOnColor] = useState("White");
    const [modalOnColor, setModalOnColor] = useState(false);
    const handleOnColorPress = (value) => {
        setOnColor(value);
        setModalOnColor(false);
    };

    const [offColor, setOffColor] = useState("Magenta");
    const [modalOffColor, setModalOffColor] = useState(false);
    const handleOffColorPress = (value) => {
        setOffColor(value);
        setModalOffColor(false);
    };
    const [childLock, setChildLock] = useState(false);
    const [backlightMode, setBacklightMode] = useState(false);

    const { currentUser, setCurrentUser, removeCurrentUser, entityId, setEntityId } = useStore();
    const [currentDevice, setCurrentDevice] = useState(null);
    useEffect(() => {
        const fetchDevice = async () => {
            try {
                console.log(`id: `, entityId)
                console.log(currentUser.token)
                const device = await getData(`/api/states/${entityId}`, currentUser.token)
                setCurrentDevice(device);
                setSwitchStatus(device.state === 'on' ? true : false)
                console.log(device);
            } catch (error) {
                console.error('Failed to load device:', error);
            }
        };
        fetchDevice();
    }, [entityId]);

    return (
        <SafeAreaView style={[styles.customSafeArea, { backgroundColor: colors.white }]}>
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.goback} onPress={() => {
                    goBack();
                }}>
                    <Entypo
                        name={"chevron-left"}
                        size={24}
                        color={colors.black}
                    />
                    <Text style={styles.gobackText}>Tất cả thiết bị</Text>
                </TouchableOpacity>
                <View style={deviceCss.container}>
                    <View style={deviceCss.switchRow}>
                        <Text style={deviceCss.label}>Status</Text>
                        <Switch
                            value={switchStatus}
                            onValueChange={handleChangeSwitchStatus}
                            style={{ height: 20 }}
                        />
                    </View>
                    <View style={deviceCss.separator} />

                    <TouchableOpacity style={deviceCss.settingRow} onPress={() => {
                        setModalPowerOnBehavior(true);
                    }}>
                        <Text style={deviceCss.label}>Power-on behavior</Text>
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={modalPowerOnBehavior}
                            onRequestClose={() => setModalPowerOnBehavior(false)}
                        >
                            <View style={deviceCss.modalContainer}>
                                <View style={deviceCss.modalView}>
                                    <Text style={deviceCss.modalText}>Select Power-on behavior</Text>
                                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: device.width * 0.8 }}>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleOnBehaviorPress('On')}>
                                            <Text style={deviceCss.buttonText}>On</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleOnBehaviorPress('Off')}>
                                            <Text style={deviceCss.buttonText}>Off</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleOnBehaviorPress('Previous')}>
                                            <Text style={deviceCss.buttonText}>Previous</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => setModalPowerOnBehavior(false)}>
                                            <Text style={deviceCss.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <Text style={deviceCss.value}>{powerOnBehavior}</Text>
                    </TouchableOpacity>
                    <View style={deviceCss.separator} />

                    <TouchableOpacity style={deviceCss.settingRow} onPress={() => { setModalIndicatorMode(true); }}>
                        <Text style={deviceCss.label}>Indicator mode</Text>
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={modalIndicatorMode}
                            onRequestClose={() => setModalIndicatorMode(false)}
                        >
                            <View style={deviceCss.modalContainer}>
                                <View style={deviceCss.modalView}>
                                    <Text style={deviceCss.modalText}>Select Indicator mode</Text>
                                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: device.width * 0.8 }}>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleIndicatorModePress('None')}>
                                            <Text style={deviceCss.buttonText}>None</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleIndicatorModePress('Relay')}>
                                            <Text style={deviceCss.buttonText}>Relay</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => handleIndicatorModePress('Pos')}>
                                            <Text style={deviceCss.buttonText}>Pos</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={deviceCss.button} onPress={() => setModalIndicatorMode(false)}>
                                            <Text style={deviceCss.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <Text style={deviceCss.value}>{indicatorMode}</Text>
                    </TouchableOpacity>
                    <View style={deviceCss.separator} />

                    <View style={deviceCss.switchRow}>
                        <Text style={deviceCss.label}>Backlight Mode</Text>
                        <Switch
                            value={backlightMode}
                            onValueChange={setBacklightMode}
                            style={{ height: 20 }}
                        />
                    </View>
                    <View style={deviceCss.separator} />

                    <View style={deviceCss.switchRow}>
                        <Text style={deviceCss.label}>Child Lock</Text>
                        <Switch
                            value={childLock}
                            onValueChange={setChildLock}
                            style={{ height: 20 }}
                        />
                    </View>
                    <View style={deviceCss.separator} />

                    <TouchableOpacity style={deviceCss.settingRow} onPress={() => { setModalBrightness(true); }}>
                        <Text style={deviceCss.label}>Brightness</Text>
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={modalBrightness}
                            onRequestClose={() => setModalBrightness(false)}
                        >
                            <View style={deviceCss.modalContainer}>
                                <View style={deviceCss.modalView}>
                                    <Text style={deviceCss.modalText}>Select Indicator mode</Text>
                                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: device.width * 0.8 }}>
                                        {oneHundredElement.map((value, index) => {
                                            return (
                                                <TouchableOpacity style={deviceCss.button} onPress={() => handleBrightnessPress(value)} key={index}>
                                                    <Text style={deviceCss.buttonText}>{value + '%'}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        <TouchableOpacity style={deviceCss.button} onPress={() => setModalBrightness(false)}>
                                            <Text style={deviceCss.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <Text style={deviceCss.value}>{brightness + '%'}</Text>
                    </TouchableOpacity>
                    <View style={deviceCss.separator} />

                    <TouchableOpacity style={deviceCss.settingRow} onPress={() => { setModalOnColor(true); }}>
                        <Text style={deviceCss.label}>ON Color</Text>
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={modalOnColor}
                            onRequestClose={() => setModalOnColor(false)}
                        >
                            <View style={deviceCss.modalContainer}>
                                <View style={deviceCss.modalView}>
                                    <Text style={deviceCss.modalText}>Select ON Color</Text>
                                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: device.width * 0.8 }}>
                                        {switchColor.map((value, index) => {
                                            return (
                                                <TouchableOpacity style={deviceCss.button} onPress={() => handleOnColorPress(value)} key={index}>
                                                    <Text style={deviceCss.buttonText}>{value}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        <TouchableOpacity style={deviceCss.button} onPress={() => setModalOnColor(false)}>
                                            <Text style={deviceCss.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <Text style={deviceCss.value}>{onColor}</Text>
                    </TouchableOpacity>
                    <View style={deviceCss.separator} />

                    <TouchableOpacity style={deviceCss.settingRow} onPress={() => { setModalOffColor(true); }}>
                        <Text style={deviceCss.label}>OFF Color</Text>
                        <Modal
                            // animationType="slide"
                            transparent={true}
                            visible={modalOffColor}
                            onRequestClose={() => setModalOffColor(false)}
                        >
                            <View style={deviceCss.modalContainer}>
                                <View style={deviceCss.modalView}>
                                    <Text style={deviceCss.modalText}>Select OFF Color</Text>
                                    <ScrollView contentContainerStyle={{ alignItems: 'center', width: device.width * 0.8 }}>
                                        {switchColor.map((value, index) => {
                                            return (
                                                <TouchableOpacity style={deviceCss.button} onPress={() => handleOffColorPress(value)} key={index}>
                                                    <Text style={deviceCss.buttonText}>{value}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                        <TouchableOpacity style={deviceCss.button} onPress={() => setModalOffColor(false)}>
                                            <Text style={deviceCss.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                        <Text style={deviceCss.value}>{offColor}</Text>
                    </TouchableOpacity>
                    <View style={deviceCss.separator} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const deviceCss = StyleSheet.create({
    deviceContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: 150,
        // backgroundColor: colors.gray_bg,
    },
    deviceName: {
        fontSize: 16,
    },
    deviceStatus: {
        fontSize: 16,
        color: colors.primary,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: colors.grey,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: device.width * 0.8,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%'
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'white',
        width: '1000%',
        alignItems: 'center',
        padding: 10
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
    },
});