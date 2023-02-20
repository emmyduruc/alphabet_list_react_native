import React, { useRef, useState, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  SectionList,
  PanResponder,
  Animated,
} from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";
import Fonts from "../../utils/fonts";

const DATA = [
  {
    title: "A",
    data: ["Atlantic", "Atlanta", "Atlas"],
  },
  {
    title: "B",
    data: ["Basin", "Basalt", "Bask"],
  },
  {
    title: "C",
    data: ["Czech", "Coke", "Cane"],
  },
  {
    title: "D",
    data: ["Desk", "Design"],
  },
  {
    title: "E",
    data: ["Eggs", "Example"],
  },
  {
    title: "F",
    data: ["Frankfurt", "Fentanyl"],
  },
  {
    title: "G",
    data: ["Guns", "Ghost"],
  },
  {
    title: "H",
    data: ["Harold", "Host"],
  },
  {
    title: "I",
    data: ["Irks", "Inked"],
  },
  {
    title: "J",
    data: ["Frankfurt", "Fentanyl"],
  },
  {
    title: "K",
    data: ["Kaliedoscope", "Kettle"],
  },
  {
    title: "L",
    data: ["Lactose", "Landslide"],
  },
  {
    title: "M",
    data: ["Max", "Mantra"],
  },
  {
    title: "N",
    data: ["Nest", "Nose"],
  },
  {
    title: "O",
    data: ["Opps", "Opportunity"],
  },
  {
    title: "P",
    data: ["Patent", "Punked"],
  },
  {
    title: "Q",
    data: ["Quest", "Quote"],
  },
  {
    title: "R",
    data: ["Rest", "Rosey"],
  },
  {
    title: "S",
    data: ["Salt", "Slow"],
  },
  {
    title: "T",
    data: ["Turkey", "Turnt"],
  },
  {
    title: "U",
    data: ["Urchins", "Uysk"],
  },
  {
    title: "V",
    data: ["Violin", "Volume"],
  },
  {
    title: "W",
    data: ["Weight", "Worst"],
  },
  {
    title: "X",
    data: ["Xerox", "Xylophone"],
  },
  {
    title: "Y",
    data: ["Yellow", "Yoke"],
  },
  {
    title: "Z",
    data: ["Zeus", "Zone"],
  },
];

const linearLayoutAnimation = () => {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation?.Presets?.linear);
};

const alphabets = [
  { letter: "A", id: 0 },
  { letter: "B", id: 1 },
  { letter: "C", id: 2 },
  { letter: "D", id: 3 },
  { letter: "E", id: 4 },
  { letter: "F", id: 5 },
  { letter: "G", id: 6 },
  { letter: "H", id: 7 },
  { letter: "I", id: 8 },
  { letter: "J", id: 9 },
  { letter: "K", id: 10 },
  { letter: "L", id: 11 },
  { letter: "M", id: 12 },
  { letter: "N", id: 13 },
  { letter: "O", id: 14 },
  { letter: "P", id: 15 },
  { letter: "Q", id: 16 },
  { letter: "R", id: 17 },
  { letter: "S", id: 18 },
  { letter: "T", id: 19 },
  { letter: "U", id: 20 },
  { letter: "V", id: 21 },
  { letter: "W", id: 22 },
  { letter: "X", id: 23 },
  { letter: "Y", id: 24 },
  { letter: "Z", id: 25 },
];

const List = () => {
  const listRef = useRef();
  const sidebarRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarItemHeight, setSidebarItemHeight] = useState(0);

  const hapticFeedbackOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const panResponder = useMemo(() => {
    var index = 0;
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, { dx, dy, x0, y0, vx, vy, moveX, moveY }) => {
        sidebarRef?.current?.measure((fx, fy, width, height, px, py) => {
          index = Math.floor((moveY - py) / sidebarItemHeight);
          setActiveIndex(index);
          if (index >= 0) {
            listRef?.current?.scrollToLocation({
              animated: true,
              sectionIndex: index,
              itemIndex: 0,
            });
          }
          ReactNativeHapticFeedback.trigger(
            "impactLight",
            hapticFeedbackOptions
          );
        });
        return false;
      },
    });
  }, [sidebarItemHeight]);

  const onSelect = (item: object) => {
    let index = DATA.findIndex((data) => data.title.charAt(0) === item.letter);
    if (index >= 0) {
      listRef?.current?.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
      });
    }
    linearLayoutAnimation();
    setActiveIndex(index);
  };

  const renderItem = ({ item, _ }) => {
    return (
      <View style={styles.titleCtn}>
        <Text
          style={[
            styles.title,
            {
              //   height: sidebarItemHeight,
            },
          ]}
        >
          {item}
        </Text>
      </View>
    );
  };

  const onLayout = useCallback(
    (event) => {
      const { height } = event.nativeEvent.layout;
      setSidebarItemHeight(height * (0.95 / alphabets.length));
    },
    [alphabets]
  );

  const getItemLayout = sectionListGetItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => 50,
    getSectionHeaderHeight: () => 30,
    // getSectionFooterHeight: () => footerHeaderHeight,
    // getSeparatorHeight: () => separatorHeight / PixelRatio.get(),
    // listHeaderHeight: () => listHeaderHeight,
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={{ flexDirection: "row" }}>
        <SectionList
          sections={DATA}
          ref={listRef}
          keyExtractor={(item, index) => item + index}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          getItemLayout={getItemLayout}
        />
        <Animated.View
          ref={sidebarRef}
          {...panResponder.panHandlers}
          style={styles.alphabetsCtn}
        >
          {alphabets.map((item, index) => {
            const { letter, id } = item;
            return (
              <TouchableOpacity
                key={String(index)}
                onPress={() => onSelect(item)}
                style={styles.alphabets}
              >
                <Text
                  style={[
                    styles.alphabets,
                    {
                      color: activeIndex === id ? "#825EE4" : "#000",
                    },
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 20,
    paddingLeft: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 30,
    backgroundColor: "#fff",
    fontFamily: Fonts.Bold,
  },
  titleCtn: {
    height: 50,
    backgroundColor: "rgba(130,94,228,0.2)",
    marginVertical: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.Bold,
    opacity: 1,
  },
  alphabetsCtn: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: 25,
  },
  alphabets: {
    fontSize: 15,
    fontFamily: Fonts.Bold,
  },
});

export default memo(List);
