
import React from "react";
import { StyleSheet, View, PanResponder, Animated, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function CustomSlider(props)
{
  // ------------------ OPTIONS ------------------------ //
  // (Use props._VALUE_ in this section if needed)
  const name = "Price";
  const icon = "checkbox-blank-circle";
  const minBoundary = props.min;
  const maxBoundary = props.max;
  const initVal = props.min;
  const colorHighlight = "#008ee6";

  // ----------------- Slider ----------------------- //
  const pan = React.useRef(new Animated.ValueXY()).current;
  const [forceRender, setForceRender] = React.useState(0);
  const animState = React.useRef(
  {
    displayMinVal:0,
    sliderWidth:0,
    stepWidth:0,
    minBoundary:0,
    maxBoundary:0,
    minBoundaryPosition:0,
    maxBoundaryPosition:0,
    offSet: 0,
    clampOffSet: 0,
    initOffSet: 0,
  }).current;

  const [sliderHeight, setSliderHeight] = React.useState(0);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [sliderCenter, setSliderCenter] = React.useState(0);
  const [initOffset, setInitOffset] = React.useState(0);
  const [minBoundaryPosition, setMinBoundaryPosition] = React.useState(0);
  const [maxBoundaryPosition, setMaxBoundaryPosition] = React.useState(0);
  const setSliderSize = (height, width) =>
  {
    setSliderHeight(height);
    const sWidth = width - height // - height : Avoid the slider to overlap the borders
    setSliderWidth(sWidth);
    animState.sliderHeight = height;
    animState.sliderWidth = sWidth;
    const stepWidth = sWidth / (maxBoundary - minBoundary);
    animState.stepWidth = stepWidth;
    animState.minBoundary = minBoundary;
    animState.maxBoundary = maxBoundary;

    const center = sWidth / 2;
    setSliderCenter(center);
    const initOff = (initVal - ((maxBoundary - minBoundary) / 2)) * stepWidth;
    setInitOffset(initOff);
    animState.initOffSet = initOff;
    animState.minBoundaryPosition = (-sWidth / 2) - initOff;
    animState.maxBoundaryPosition = (sWidth / 2) - initOff;
    setMinBoundaryPosition((-sWidth / 2) - initOff);
    setMaxBoundaryPosition((sWidth / 2) - initOff);

    placeSlider();
  };

  const placeSlider = () =>
  {
    const newVal =
      pan.x._value +
      animState.offSet +
      animState.initOffSet -
      animState.clampOffSet;
    setForceRender(newVal); // Update the state so the render function is called (and elements are updated on screen)
    
    let filterVal = Math.trunc((newVal + animState.sliderWidth/2 + animState.stepWidth/2) / animState.stepWidth);
    filterVal = Math.min(maxBoundary, filterVal);
    filterVal = Math.max(minBoundary, filterVal);
    animState.displayMinVal = filterVal;
  };

  const getPanResponder = () =>
  {
    return PanResponder.create(
    {
        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () =>
        {
          const clamp = Math.max(animState.minBoundaryPosition, Math.min(animState.maxBoundaryPosition, pan.x._value));
          animState.clampOffSet = animState.clampOffSet + pan.x._value - clamp;
          pan.setOffset({x:clamp, y:0});
          props.onValuesChange(animState.displayMinVal.toString())
        },
        onPanResponderMove: (e, gesture) =>
        {
          placeSlider();
          Animated.event([null, { dx: pan.x, dy: pan.y }], {})(e, {dx:gesture.dx, dy:0});
          props.onValuesChange(animState.displayMinVal.toString())
        },
        onPanResponderRelease: (e, gesture) =>
        {
          animState.offSet = animState.offSet + pan.x._value;
          pan.flattenOffset();
          props.onValuesChange(animState.displayMinVal.toString())
        }
    });
  };
  const [panResponder, setPanResponder] = React.useState(getPanResponder());

  // ----------------- Render ----------------------- //
  return (
    <View style={s.mainContainer}>
      <View style={s.container}>
        {/*<View style={s.labelValue}>
          <Text style={s.labelValueText}>{animState.displayMinVal}</Text>
        </View>*/}
        <View
          style={s.sliderContainer}
          onLayout={(event) => setSliderSize(event.nativeEvent.layout.height, event.nativeEvent.layout.width)}
        >
          <View style={s.lineContainer}>
            <Animated.View style={[
              s.line,
              [{ translateX: pan.x.interpolate(
                {
                  inputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                  outputRange: [
                    Math.min(minBoundaryPosition + initOffset - sliderWidth/2, maxBoundaryPosition + initOffset - sliderWidth/2),
                    Math.max(minBoundaryPosition + initOffset - sliderWidth/2, maxBoundaryPosition + initOffset - sliderWidth/2)
                  ],
                  extrapolate: 'clamp'
                })
              }],
              ]} />
          </View>
          <Animated.View
            style={[
              s.draggable,
              { transform:
                [{ translateX: pan.x.interpolate(
                  {
                    inputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                    outputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                    extrapolate: 'clamp'
                  })
                }]
              },
              {left:sliderCenter + initOffset}
            ]}
            {...panResponder.panHandlers}
          >
            <View style={s.circle}>
              <View style={s.icon}>
                <MaterialCommunityIcons name={icon} size={25} color={colorHighlight} />
              </View>             
            </View>
          </Animated.View>
         
        </View>
        {/*<View style={s.labelValue}>
          <Text style={s.labelValueText}>{animState.displayMinVal}</Text>
        </View>*/}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  mainContainer:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width:"100%",
    aspectRatio:4,
  },
  container:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flex: 1,
    flexDirection: "row",
  },

  labelValue:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flex: 1,
  },
  labelValueText:
  {
    fontSize:11,
  },

  sliderContainer:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height:"100%",
    flex: 8,
  },
  lineContainer:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    height:4,
    width:"80%",
    flexDirection:'row',
    position: "absolute",
    left:"10%",
    top:"50%",
    marginTop:-3,
    borderRadius: 60,
    backgroundColor:"grey",
  },
  line:
  {
    height:"100%",
    width:"100%",
    backgroundColor:"#008ee6",
  },
  draggable:
  {
    alignItems: "center",
    justifyContent: "center",
    height:"100%",
    aspectRatio:1.1,
    position:'absolute',
    top:-2,
    borderRadius:100,
    overflow: "visible",
  },
  circle:
  {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 2.8,
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 60,  
    overflow: "visible",
  },
  icon:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  labelContainer:
  {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width:"100%",
    aspectRatio:3,
    position:'absolute',
    bottom:0,
  },
  label:
  {
    fontSize:9,
  },
});