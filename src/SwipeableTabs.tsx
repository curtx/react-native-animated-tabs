import React, { useEffect } from "react";
import { Animated, Dimensions, GestureResponderEvent, StyleSheet, View } from "react-native";

interface IProps {
   /**  When a swipe is completed onSwipe is called with selected index.
    * */
    onSwipe?: (index: number) => any 
    /**
     *  Changing selectedIndex animates the component to the corresponding tab.
     */
    selectedIndex?: number
    /**
     * Pass components or screens as children and they will be rendered in tabs.
     */
    children?: any
}
const { width } = Dimensions.get("screen")
const animated = new Animated.Value(-width)
var startPageX = 0

export default function SwipeableTabs(props: IProps) {
    var selectedIndex = 0;
    let { children, onSwipe } = props
    if (typeof children == "object")
    children=[children]
    const Tabs = children || []

    function onTouchStart(e:GestureResponderEvent) {
        startPageX = selectedIndex * width + e.nativeEvent.pageX
    }

    function onTouchMove(e:GestureResponderEvent) {
        let offset = startPageX - e.nativeEvent.pageX
        if (offset >= 0 && offset < width * (Tabs.length - 1))
            Animated.timing(animated, {
                toValue: -offset,
                duration: 0,
                useNativeDriver: true,
            }).start()
    }

    function onTouchEnd(e:GestureResponderEvent) {
        let offset = startPageX - e.nativeEvent.pageX
        selectedIndex = Math.max(0, Math.min(Tabs.length - 1, Math.round(offset / width)))
        Animated.timing(animated, {
            toValue: -selectedIndex * width,
            duration: 0,
            useNativeDriver: true,
        }).start()
        onSwipe(selectedIndex)
    }

    useEffect(() => {
        if (props.selectedIndex != undefined) {
            selectedIndex = props.selectedIndex
            Animated.timing(animated, {
                toValue: -props.selectedIndex * width,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }

    }, [props.selectedIndex])
  
    return (children && children.length) ? (<View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        style={styles.window}
    >
        <Animated.View

            style={[styles.body, { width: width * Tabs.length, transform: [{ translateX: animated }] }]}>
            {Tabs.map((tab:any, index:number) => (
                <View key={index} style={styles.tab}>
                    {tab}
                </View>
            ))}
        </Animated.View>
    </View>) : null

}
const styles = StyleSheet.create({
    window: {
        width,
        height: "100%",

    },
    body: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
    },
    tab: {
        width,
        overflow: "hidden",
        height: "100%",
    }
})