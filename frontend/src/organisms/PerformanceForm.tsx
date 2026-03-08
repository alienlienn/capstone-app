import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, Pressable, Image } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors } from "../styles/colors";
import Button from "../atoms/Button";
import { styles as globalStyles } from "../styles/styles";

const screenWidth = Dimensions.get("window").width;

interface PerformanceFormProps {
  selectedSubject: string;
  progressData: { labels: string[]; datasets: { data: number[] }[] } | null;
  trends: string[];
  onAdjustSelection: () => void;
}

export default function PerformanceForm({ 
  selectedSubject, 
  progressData, 
  trends, 
  onAdjustSelection 
}: PerformanceFormProps) {
  
  const minScore = progressData ? Math.min(...progressData.datasets[0].data) : 0;
  const maxScore = progressData ? Math.max(...progressData.datasets[0].data) : 100;
  
  const chartMin = Math.max(0, Math.floor(minScore - 10));
  const chartMax = Math.min(100, Math.ceil(maxScore + 10));

  const generateTrendExplanation = () => {
    if (!progressData || !trends) return "";
    const data = progressData.datasets[0].data;
    const insights: string[] = [];

    trends.forEach((tr, i) => {
      if (tr === "neutral" || i === 0) return;
      
      const diff = data[i] - data[i-1];
      const termLabel = progressData.labels[i];
      const magnitude = Math.abs(diff).toFixed(1);

      if (tr === "sharp_decrease") {
        insights.push(`Detected a sharp drop of ${magnitude}% in ${termLabel}.`);
      } else if (tr === "constant_decrease") {
        insights.push(`Observing a steady decline in ${termLabel} (down ${magnitude}% from previous).`);
      } else if (tr === "sharp_increase") {
        insights.push(`Strong recovery! Performance jumped by ${magnitude}% in ${termLabel}.`);
      } else if (tr === "constant_increase") {
        insights.push(`Consistent growth maintained in ${termLabel} with a ${magnitude}% increase.`);
      }
    });

    return insights.length > 0 ? insights.join(" ") : "Performance remains stable within this period.";
  };

  return (
    <View style={{ flex: 1 }}>
        <View style={globalStyles.screenTopHeader}>
            <Pressable onPress={onAdjustSelection} style={{ padding: 8 }}>
                <Image 
                    source={require("../../assets/chevron_icons/chevron_left.png")} 
                    style={{ width: 20, height: 20 }}
                />
            </Pressable>
            <Text style={[globalStyles.screenTopHeaderLabel, { marginRight: 28 }]}>
                Report Analysis
            </Text>
        </View>

        <ScrollView style={localStyles.container}>
            <View style={{ width: '88%', alignSelf: 'center', paddingVertical: 20 }}>
                
                <View style={localStyles.chartCard}>
                    <Text style={[localStyles.chartTitle, { width: '90%' }]}>
                        {selectedSubject === "Overall" ? "Overall Results(%) Trend" : `${selectedSubject} Trend`}
                    </Text>
                    
                    {progressData && (
                        <LineChart
                            data={progressData}
                            width={screenWidth * 0.82}
                            height={230}
                            chartConfig={{
                                backgroundColor: "white",
                                backgroundGradientFrom: "white",
                                backgroundGradientTo: "white",
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                style: { borderRadius: 16 },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: colors.primary_600
                                },
                            }}
                            yAxisInterval={1}
                            fromZero={false}
                            fromNumber={chartMax}
                            segments={4}
                            formatYLabel={(yValue) => {
                              const val = parseFloat(yValue);
                              // Calculate based on range
                              const range = chartMax - chartMin;
                              const segments = Math.min(5, Math.ceil(range / 5) || 5);
                              const step = range / segments;
                              return Math.round(val).toString();
                            }}
                            bezier
                            style={{ 
                              borderRadius: 16, 
                              marginVertical: 8,
                              marginLeft: -22
                            }}
                            onDataPointClick={({ index, value }) => {
                                const tr = trends[index];
                                if (tr === "sharp_decrease") {
                                    Alert.alert("Performance Alert", `A sharp decrease to ${value.toFixed(1)}% was detected. Immediate intervention is recommended.`);
                                } else if (tr === "constant_decrease") {
                                    Alert.alert("Performance Concern", `A constant decline was detected. Steady monitoring is advised.`);
                                } else if (tr === "sharp_increase") {
                                    Alert.alert("Performance Excellence", `A sharp increase to ${value.toFixed(1)}% was detected! Great job!`);
                                } else if (tr === "constant_increase") {
                                    Alert.alert("Positive Growth", `Keep it up! A consistent steady increase was detected.`);
                                }
                            }}
                            renderDotContent={({ x, y, index }) => {
                                const tr = trends[index];
                                let color = "transparent";
                                if (tr === "sharp_decrease") color = colors.error;
                                else if (tr === "constant_decrease") color = "#FB923C"; // Orange
                                else if (tr === "sharp_increase") color = "#22C55E"; // Green
                                else if (tr === "constant_increase") color = "#60A5FA"; // Light Blue
                                
                                if (color === "transparent") return null;
                                return (
                                    <View 
                                        key={index}
                                        style={[localStyles.anomalyDot, { left: x - 6, top: y - 6, backgroundColor: color }]} 
                                    />
                                );
                            }}
                        />
                    )}

                    <View style={localStyles.legendContainer}>
                        <View style={[localStyles.legendItem, { backgroundColor: colors.error }]} />
                        <Text style={localStyles.legendText}>Sharp Drop</Text>
                        <View style={[localStyles.legendItem, { backgroundColor: "#22C55E", marginLeft: 15 }]} />
                        <Text style={localStyles.legendText}>Sharp Gain</Text>
                        <View style={[localStyles.legendItem, { backgroundColor: "#FB923C", marginLeft: 15 }]} />
                        <Text style={localStyles.legendText}>Steady Decline</Text>
                    </View>
                </View>

                {trends.some(t => t !== "neutral") && (
                    <View style={[localStyles.alertBox, { backgroundColor: trends.some(t => t.includes("increase")) ? "#F0FDF4" : "#FFF1F2" }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <Text style={{ fontSize: 14 }}>{trends.some(t => t.includes("increase")) ? "✨" : "⚠️"}</Text>
                            <Text style={[localStyles.alertText, { fontWeight: '800', marginLeft: 6, fontSize: 14, textAlign: "center", color: trends.some(t => t.includes("increase")) ? "#166534" : "#9F1239" }]}>
                                Trend Analysis Report:
                            </Text>
                        </View>
                        <Text style={[localStyles.alertText, { color: trends.some(t => t.includes("increase")) ? "#166534" : "#9F1239" }]}>
                            {generateTrendExplanation()}
                        </Text>
                    </View>
                )}

                <View style={localStyles.statSummary}>
                    <View style={localStyles.summaryRow}>
                        <View style={localStyles.summaryItem}>
                            <Text style={localStyles.summaryLabel}>Highest Score</Text>
                            <Text style={localStyles.summaryValue}>
                                {Math.max(...(progressData?.datasets[0].data || [0])).toFixed(1)}
                                {selectedSubject === "Overall" ? "%" : ""}
                            </Text>
                        </View>
                        <View style={localStyles.verticalDivider} />
                        <View style={localStyles.summaryItem}>
                            <Text style={localStyles.summaryLabel}>Average Score</Text>
                            <Text style={localStyles.summaryValue}>
                                {( (progressData?.datasets[0].data.reduce((a,b)=>a+b,0) || 0) / (progressData?.datasets[0].data.length || 1) ).toFixed(1)}
                                {selectedSubject === "Overall" ? "%" : ""}
                            </Text>
                        </View>
                    </View>
                </View>

                <Button 
                    buttonTitle="Adjust Selection"
                    onPressButton={onAdjustSelection}
                    buttonStyle={[localStyles.adjustButton, { backgroundColor: '#E2E8F0', marginTop: 20 }]}
                    textStyle={{ color: '#475569' }}
                />

            </View>
        </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    backgroundColor: colors.background_color,
  },
  chartCard: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 16,
    textTransform: 'uppercase',
    textAlign: "center",
    letterSpacing: 0.5,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  legendItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "700",
    color: '#64748B',
    marginLeft: 6
  },
  anomalyDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
  },
  alertBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 16,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 20,
  },
  statSummary: {
    marginTop: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  verticalDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#94A3B8",
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '45%',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: "#94A3B8",
    marginBottom: 6,
    textTransform: 'uppercase',
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.primary_700,
    textAlign: "center",
  },
  adjustButton: {
    borderRadius: 10,
    height: 52,
    width: "100%",
  }
});
