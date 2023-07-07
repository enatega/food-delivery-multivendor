import React from "react";
import { Text,View,Image,Platform} from "react-native";
export const MapCallout = (props) => {
    return (
        <View style={{width: 120, alignItems: 'center'}}>
        <Text>{props.rest.name}</Text>
        </View>
    )

}