import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Appearance,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  useWindowDimensions,
  View
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context";

import { CASE_LIBRARY } from "./src/data/cases";
import { createEmptyProgress } from "./src/lib/progress";

const THEMES = {
  light: {
    bg: "#f4f7f8",
    surface: "#ffffff",
    surfaceMuted: "#eef3f4",
    ink: "#122022",
    muted: "#667477",
    accent: "#0f7a73",
    accentSoft: "#e0f1ee",
    accentText: "#0c5f59",
    danger: "#a3483e",
    dangerSoft: "#f4e6e2",
    line: "rgba(18, 32, 34, 0.12)",
    lineSoft: "rgba(18, 32, 34, 0.07)",
    headerOverlay: "rgba(244, 247, 248, 0.94)",
    footerBg: "#ffffff",
    cardActive: "#ffffff",
    correctSurface: "#eaf5f2",
    correctBorder: "rgba(15, 122, 115, 0.26)",
    incorrectSurface: "#f4e6e2",
    incorrectBorder: "rgba(163, 72, 62, 0.24)",
    shadow: "#000000",
    progressIdle: "#c6cfcb"
  },
  dark: {
    bg: "#0f1415",
    surface: "#152022",
    surfaceMuted: "#1d2a2c",
    ink: "#f4efe7",
    muted: "#98a5a7",
    accent: "#72c4bd",
    accentSoft: "#1c3736",
    accentText: "#8ee0d8",
    danger: "#e08f7d",
    dangerSoft: "#312423",
    line: "rgba(244, 239, 231, 0.10)",
    lineSoft: "rgba(244, 239, 231, 0.06)",
    headerOverlay: "rgba(15, 20, 21, 0.94)",
    footerBg: "#12191a",
    cardActive: "#1a2729",
    correctSurface: "#21302d",
    correctBorder: "rgba(114, 196, 189, 0.28)",
    incorrectSurface: "#2a2422",
    incorrectBorder: "rgba(224, 143, 125, 0.24)",
    shadow: "#000000",
    progressIdle: "#596466"
  }
};

const IOS_CONTINUOUS = Platform.OS === "ios" ? { borderCurve: "continuous" } : {};
const RADIUS_OUTER_MD = 22;
const PADDING_SECTION = 16;
const RADIUS_INNER_MD = RADIUS_OUTER_MD - PADDING_SECTION;
const RUN_HISTORY_STORAGE_KEY = "biss-trainer-run-history-v1";
const CURRENT_RUN_STORAGE_KEY = "biss-trainer-current-run-v1";

function de(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(/Ae/g, "Ä")
    .replace(/Oe/g, "Ö")
    .replace(/Ue/g, "Ü")
    .replace(/ae/g, "ä")
    .replace(/oe/g, "ö")
    .replace(/ue/g, "ü");
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppScreen />
    </SafeAreaProvider>
  );
}

function AppScreen() {
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() ?? "light"
  );
  const insets = useSafeAreaInsets();
  const theme = colorScheme === "dark" ? THEMES.dark : THEMES.light;
  const styles = createStyles(theme);
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const libraryCardWidth = Math.min(Math.max(width - 104, 216), 270);
  const librarySnapInterval = libraryCardWidth + 10;
  const scrollTargetOffset = 12;
  const bottomDockInset = Math.max(insets.bottom, 8);
  const contentBottomInset = bottomDockInset + 16;
  const scrollRef = useRef(null);
  const libraryScrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [caseOrder, setCaseOrder] = useState(() => CASE_LIBRARY.map((caseItem) => caseItem.id));
  const [activeCaseId, setActiveCaseId] = useState(CASE_LIBRARY[0].id);
  const [progressByCase, setProgressByCase] = useState({});
  const [completedRuns, setCompletedRuns] = useState([]);
  const [hasCapturedRun, setHasCapturedRun] = useState(false);
  const [latestRunId, setLatestRunId] = useState(null);
  const [hasLoadedCurrentRun, setHasLoadedCurrentRun] = useState(false);
  const [hasLoadedRuns, setHasLoadedRuns] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    findings: true,
    resources: false
  });
  const [anchors, setAnchors] = useState({
    step: 0,
    quiz: 0
  });

  const orderedCases = getOrderedCases(caseOrder);
  const activeCase =
    orderedCases.find((caseItem) => caseItem.id === activeCaseId) ??
    orderedCases[0] ??
    CASE_LIBRARY[0];
  const activeProgress = getProgress(progressByCase, activeCase.id);
  const activeStep = activeCase.steps[activeProgress.activeStepIndex];
  const selectedAnswerIndex =
    activeProgress.answers[activeProgress.activeStepIndex];
  const hasAnsweredCurrentStep = selectedAnswerIndex !== undefined;
  const selectedAnswer = hasAnsweredCurrentStep
    ? activeStep.question.options[selectedAnswerIndex]
    : null;
  const totalScore = getTotalScore(progressByCase);
  const totalPossibleScore = getTotalPossibleScore();
  const completedCount = CASE_LIBRARY.filter(
    (caseItem) => getProgress(progressByCase, caseItem.id).completed
  ).length;
  const allCasesCompleted = completedCount === CASE_LIBRARY.length;
  const currentRunHasProgress = CASE_LIBRARY.some((caseItem) => {
    const progress = getProgress(progressByCase, caseItem.id);
    return progress.completed || Object.keys(progress.answers).length > 0;
  });
  const activeCaseScore = getScoreForCase(activeCase, activeProgress);
  const activeCaseMaxScore = getMaxScoreForCase(activeCase);
  const activeCaseHasProgress =
    activeProgress.completed || Object.keys(activeProgress.answers).length > 0;
  const headerTitleScale = scrollY.interpolate({
    inputRange: [-120, 0, 120],
    outputRange: [1.12, 1, 0.84],
    extrapolate: "clamp"
  });
  const headerTitleTranslateX = scrollY.interpolate({
    inputRange: [-120, 0, 120],
    outputRange: [4, 0, 10],
    extrapolate: "clamp"
  });
  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [-120, 0, 120],
    outputRange: [-4, 0, 1],
    extrapolate: "clamp"
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: nextScheme }) => {
      setColorScheme(nextScheme ?? "light");
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentRun() {
      try {
        const raw = await AsyncStorage.getItem(CURRENT_RUN_STORAGE_KEY);
        if (!raw || cancelled) {
          return;
        }

        const parsed = JSON.parse(raw);
        const savedOrder = Array.isArray(parsed?.caseOrder)
          ? parsed.caseOrder.filter((caseId) =>
              CASE_LIBRARY.some((caseItem) => caseItem.id === caseId)
            )
          : [];
        const missingCaseIds = CASE_LIBRARY.map((caseItem) => caseItem.id).filter(
          (caseId) => !savedOrder.includes(caseId)
        );
        const nextOrder =
          savedOrder.length > 0
            ? [...savedOrder, ...missingCaseIds]
            : CASE_LIBRARY.map((caseItem) => caseItem.id);

        setCaseOrder(nextOrder);
        setActiveCaseId(
          CASE_LIBRARY.some((caseItem) => caseItem.id === parsed?.activeCaseId)
            ? parsed.activeCaseId
            : nextOrder[0] ?? CASE_LIBRARY[0].id
        );
        setProgressByCase(
          parsed?.progressByCase && typeof parsed.progressByCase === "object"
            ? parsed.progressByCase
            : {}
        );
      } catch {
        // Ignore invalid local progress and continue with a fresh run.
      } finally {
        if (!cancelled) {
          setHasLoadedCurrentRun(true);
        }
      }
    }

    loadCurrentRun();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedCurrentRun) {
      return;
    }

    AsyncStorage.setItem(
      CURRENT_RUN_STORAGE_KEY,
      JSON.stringify({
        activeCaseId,
        caseOrder,
        progressByCase
      })
    ).catch(() => {});
  }, [activeCaseId, caseOrder, hasLoadedCurrentRun, progressByCase]);

  useEffect(() => {
    let cancelled = false;

    async function loadRunHistory() {
      try {
        const raw = await AsyncStorage.getItem(RUN_HISTORY_STORAGE_KEY);
        if (!raw || cancelled) {
          return;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.runs)) {
          setCompletedRuns(parsed.runs);
        }
        if (typeof parsed?.latestRunId === "number") {
          setLatestRunId(parsed.latestRunId);
        }
      } catch {
        // Ignore invalid local history and continue with an empty leaderboard.
      } finally {
        if (!cancelled) {
          setHasLoadedRuns(true);
        }
      }
    }

    loadRunHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRuns) {
      return;
    }

    AsyncStorage.setItem(
      RUN_HISTORY_STORAGE_KEY,
      JSON.stringify({
        runs: completedRuns,
        latestRunId
      })
    ).catch(() => {});
  }, [completedRuns, hasLoadedRuns, latestRunId]);

  useEffect(() => {
    if (!allCasesCompleted) {
      if (hasCapturedRun) {
        setHasCapturedRun(false);
      }
      return;
    }

    if (hasCapturedRun) {
      return;
    }

    setCompletedRuns((current) => {
      const entryId = current.length + 1;
      setLatestRunId(entryId);
      return [
        ...current,
        {
          id: entryId,
          label: `Durchlauf ${entryId}`,
          score: totalScore
        }
      ];
    });
    setHasCapturedRun(true);
  }, [allCasesCompleted, hasCapturedRun, totalScore]);

  async function triggerHaptic(kind = "selection") {
    try {
      if (Platform.OS === "android") {
        if (kind === "success") {
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
          return;
        }

        if (kind === "warning") {
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject);
          return;
        }

        if (kind === "impact") {
          await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Context_Click);
          return;
        }

        await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
        return;
      }

      if (kind === "success") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }

      if (kind === "warning") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      if (kind === "impact") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        return;
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    } catch {
      Vibration.vibrate(kind === "warning" ? 20 : 12);
    }
  }

  function scrollToAnchor(targetY) {
    scrollRef.current?.scrollTo({
      y: Math.max(targetY - scrollTargetOffset, 0),
      animated: true
    });
  }

  function updateCaseProgress(caseId, updater) {
    setProgressByCase((current) => {
      const currentProgress = getProgress(current, caseId);
      const nextProgress = updater(currentProgress);

      return {
        ...current,
        [caseId]: nextProgress
      };
    });
  }

  function toggleSection(sectionKey) {
    void triggerHaptic("selection");
    setSectionsOpen((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey]
    }));
  }

  function focusCaseByIndex(caseIndex) {
    const nextCase = orderedCases[caseIndex];

    if (!nextCase) {
      return;
    }

    setActiveCaseId(nextCase.id);
    setSectionsOpen({
      findings: true,
      resources: false
    });

    requestAnimationFrame(() => {
      libraryScrollRef.current?.scrollTo({
        x: caseIndex * librarySnapInterval,
        animated: true
      });
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true
      });
    });
  }

  function handleSelectCase(caseId) {
    void triggerHaptic("selection");
    const caseIndex = orderedCases.findIndex((caseItem) => caseItem.id === caseId);
    focusCaseByIndex(caseIndex);
  }

  function handleRestartRun() {
    void triggerHaptic("impact");

    const nextOrder = shuffleCaseIds();
    const nextFirstCaseId = nextOrder[0] ?? CASE_LIBRARY[0].id;

    setProgressByCase({});
    setCaseOrder(nextOrder);
    setActiveCaseId(nextFirstCaseId);
    setHasCapturedRun(false);
    setSectionsOpen({
      findings: true,
      resources: false
    });

    requestAnimationFrame(() => {
      libraryScrollRef.current?.scrollTo({
        x: 0,
        animated: true
      });
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true
      });
    });
  }

  function handleResetRun() {
    void triggerHaptic("warning");

    const firstCaseId = caseOrder[0] ?? CASE_LIBRARY[0].id;

    setProgressByCase({});
    setActiveCaseId(firstCaseId);
    setHasCapturedRun(false);
    setSectionsOpen({
      findings: true,
      resources: false
    });

    requestAnimationFrame(() => {
      libraryScrollRef.current?.scrollTo({
        x: 0,
        animated: true
      });
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true
      });
    });
  }

  function handleStartCase() {
    void triggerHaptic("impact");
    const hasStarted = Object.keys(activeProgress.answers).length > 0;
    const targetY = hasStarted ? anchors.quiz : anchors.step;
    scrollToAnchor(targetY);
  }

  function handleScrollToQuiz() {
    void triggerHaptic("selection");
    scrollToAnchor(anchors.quiz);
  }

  function handleAnswer(optionIndex) {
    if (hasAnsweredCurrentStep || activeProgress.completed) {
      return;
    }

    const option = activeStep.question.options[optionIndex];
    void triggerHaptic(option.correct ? "success" : "warning");

    updateCaseProgress(activeCase.id, (current) => ({
      ...current,
      answers: {
        ...current.answers,
        [current.activeStepIndex]: optionIndex
      }
    }));
  }

  function handleNextStep() {
    void triggerHaptic("impact");
    updateCaseProgress(activeCase.id, (current) => ({
      ...current,
      activeStepIndex: Math.min(
        current.activeStepIndex + 1,
        activeCase.steps.length - 1
      )
    }));
  }

  function handleFinishCase() {
    void triggerHaptic("success");
    updateCaseProgress(activeCase.id, (current) => ({
      ...current,
      completed: true,
      activeStepIndex: activeCase.steps.length - 1
    }));

    const currentCaseIndex = orderedCases.findIndex(
      (caseItem) => caseItem.id === activeCase.id
    );
    const nextCaseIndex = currentCaseIndex + 1;

    if (nextCaseIndex < CASE_LIBRARY.length) {
      focusCaseByIndex(nextCaseIndex);
      return;
    }

    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({
        animated: true
      });
    });
  }

  function handleResetCase(caseId) {
    Alert.alert(
      "Fall zurücksetzen",
      "Der Fortschritt für diesen Fall wird gelöscht.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Zurücksetzen",
          style: "destructive",
          onPress: () => {
            void triggerHaptic("warning");
            setProgressByCase((current) => ({
              ...current,
              [caseId]: createEmptyProgress()
            }));
          }
        }
      ]
    );
  }

  function handleResetAll() {
    if (allCasesCompleted) {
      Alert.alert(
        "Neu starten",
        "Ein neuer Durchlauf startet mit gemischter Reihenfolge. Dein lokales Leaderboard bleibt erhalten.",
        [
          { text: "Abbrechen", style: "cancel" },
          {
            text: "Neu starten",
            onPress: handleRestartRun
          }
        ]
      );
      return;
    }

    Alert.alert(
      "Zurücksetzen",
      "Der aktuelle Durchlauf wird zurückgesetzt. Deine lokale Bestenliste bleibt erhalten.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Zurücksetzen",
          style: "destructive",
          onPress: handleResetRun
        }
      ]
    );
  }

  const bottomAction = getBottomAction({
    hasAnsweredCurrentStep,
    activeProgress,
    activeCase,
    handleScrollToQuiz,
    handleNextStep,
    handleFinishCase
  });
  const bottomMetaLabel = activeProgress.completed
    ? "Fall abgeschlossen"
    : `Schritt ${activeProgress.activeStepIndex + 1}/${activeCase.steps.length}`;
  const bottomMetaTitle = activeProgress.completed
    ? `${activeCaseScore}/${activeCaseMaxScore} Punkte`
    : de(activeStep.phase);
  const localLeaderboard = [...completedRuns].sort(
    (left, right) => right.score - left.score || left.id - right.id
  );
  const bestLocalRun = localLeaderboard[0] ?? null;
  const latestRunRank =
    latestRunId === null
      ? 0
      : localLeaderboard.findIndex((entry) => entry.id === latestRunId) + 1;

  return (
    <View style={styles.root}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View style={styles.safeArea}>
        <View style={styles.appShell}>
          <Animated.ScrollView
            ref={scrollRef}
            style={styles.screen}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: contentBottomInset },
              isCompact && styles.contentCompact
            ]}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          >
            <View style={[styles.topBarWrap, { paddingTop: insets.top + 6 }]}>
              <View style={styles.topBar}>
                <Animated.Text
                  style={[
                    styles.brandLabel,
                    {
                      transform: [
                        { translateX: headerTitleTranslateX },
                        { translateY: headerTitleTranslateY },
                        { scale: headerTitleScale }
                      ]
                    }
                  ]}
                >
                  BissTrainer
                </Animated.Text>
                <Text style={styles.headerMeta}>{totalScore} Punkte</Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryEyebrow}>Challenge 5</Text>
                <Text style={styles.summaryTitle}>Klinische Fälle trainieren</Text>
                <Text style={styles.summaryMeta}>
                  {CASE_LIBRARY.length} Fälle · {completedCount} abgeschlossen · {totalScore} Punkte
                </Text>
              </View>
              <View style={styles.summaryMetricGrid}>
                <MetricPill
                  styles={styles}
                  label="Quote"
                  value={`${Math.round((totalScore / totalPossibleScore) * 100)}%`}
                />
                <MetricPill
                  styles={styles}
                  label="Aktiv"
                  value={de(activeCase.domain)}
                />
              </View>
            </View>
            
            <SectionHeader
              styles={styles}
              eyebrow="Bibliothek"
              title="Deine Fälle"
              actionLabel={
                allCasesCompleted
                  ? "Neu starten"
                  : currentRunHasProgress
                    ? "Zurücksetzen"
                    : null
              }
              onPress={handleResetAll}
            />

            <View
              style={[
                styles.libraryViewport,
                isCompact && styles.libraryViewportCompact
              ]}
            >
              <Animated.ScrollView
                ref={libraryScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={librarySnapInterval}
                contentContainerStyle={[
                  styles.libraryScroll,
                  isCompact && styles.libraryScrollCompact
                ]}
                style={styles.libraryScroller}
                decelerationRate="fast"
                snapToAlignment="start"
                disableIntervalMomentum
              >
                {orderedCases.map((caseItem) => {
                  const caseProgress = getProgress(progressByCase, caseItem.id);
                  const isActive = caseItem.id === activeCase.id;
                  const caseScore = getScoreForCase(caseItem, caseProgress);
                  const caseMaxScore = getMaxScoreForCase(caseItem);

                  return (
                    <Pressable
                      key={caseItem.id}
                      onPress={() => handleSelectCase(caseItem.id)}
                      style={[
                        styles.libraryCard,
                        IOS_CONTINUOUS,
                        { width: libraryCardWidth },
                        caseProgress.completed && styles.libraryCardCompleted,
                        isActive && styles.libraryCardActive
                      ]}
                    >
                      <View style={styles.libraryCardTopRow}>
                        <Text style={styles.libraryDomain}>{de(caseItem.domain)}</Text>
                        {caseProgress.completed ? (
                          <View style={[styles.libraryStatusBadge, IOS_CONTINUOUS]}>
                            <Text style={styles.libraryStatusBadgeText}>
                              Abgeschlossen
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Text
                        style={styles.libraryTitle}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {de(caseItem.title)}
                      </Text>
                      <Text style={styles.libraryMeta}>
                        {de(caseItem.difficulty)} · {de(caseItem.duration)}
                      </Text>
                      <Text style={styles.libraryMeta}>
                        {getCompletionLabel(caseProgress)} · {caseScore}/{caseMaxScore} P
                      </Text>
                    </Pressable>
                  );
                })}
              </Animated.ScrollView>
            </View>

            <View style={[styles.sectionCard, IOS_CONTINUOUS]}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeaderCopy}>
                <Text style={styles.tag}>{de(activeCase.domain)}</Text>
                <Text style={styles.sectionTitleLarge}>{de(activeCase.title)}</Text>
              </View>
              <Text style={styles.modelMeta}>{de(activeCase.model)}</Text>
            </View>

            <Text style={styles.caseMetaLine}>
              {de(activeCase.difficulty)} · {de(activeCase.duration)} ·{" "}
              {activeCase.steps.length} Schritte · {activeCaseScore}/
              {activeCaseMaxScore} Punkte
            </Text>

            <Text style={styles.bodyText} numberOfLines={2}>
              {de(activeCase.summary)}
            </Text>

            <View style={styles.infoStack}>
              <InfoCell styles={styles} label="Patient:in" value={de(activeCase.patient)} />
              <InfoCell
                styles={styles}
                label="Schwierigkeit"
                value={de(activeCase.difficulty)}
              />
              <InfoCell styles={styles} label="Dauer" value={de(activeCase.duration)} />
            </View>

            <View style={styles.goalList}>
              {activeCase.learningGoals.map((goal) => (
                <View key={goal} style={[styles.goalChip, IOS_CONTINUOUS]}>
                  <Text style={styles.goalText}>
                    {de(goal)}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.inlineBlock}>
              <Text style={styles.inlineLabel}>Fortschritt</Text>
              <View style={styles.progressTrack}>
                {activeCase.steps.map((step, index) => {
                  const isDone =
                    index < activeProgress.activeStepIndex || activeProgress.completed;
                  const isCurrent =
                    index === activeProgress.activeStepIndex &&
                    !activeProgress.completed;

                  return (
                    <View
                      key={`${activeCase.id}-${step.phase}`}
                      style={[styles.progressItem, IOS_CONTINUOUS]}
                    >
                      <View
                        style={[
                          styles.progressDot,
                          isDone && styles.progressDotDone,
                          isCurrent && styles.progressDotCurrent
                        ]}
                      />
                      <Text style={styles.progressLabel}>{de(step.phase)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.actionStack}>
              <PrimaryButton
                styles={styles}
                label={
                  activeProgress.completed
                    ? "Ergebnis ansehen"
                    : Object.keys(activeProgress.answers).length > 0
                      ? "Zum Quiz"
                      : "Fall starten"
                }
                onPress={handleStartCase}
              />
              {activeCaseHasProgress ? (
                <SecondaryButton
                  styles={styles}
                  label="Fall zurücksetzen"
                  onPress={() => handleResetCase(activeCase.id)}
                />
              ) : null}
            </View>
          </View>

          <View
            style={[styles.sectionCard, IOS_CONTINUOUS]}
            onLayout={(event) => {
              const stepY = event.nativeEvent.layout.y;
              setAnchors((current) => ({
                ...current,
                step: stepY
              }));
            }}
          >
            <Text style={styles.tag}>{de(activeStep.phase)}</Text>
            <Text style={styles.sectionTitleLarge}>{de(activeStep.title)}</Text>
            <Text style={styles.bodyText}>{de(activeStep.prompt)}</Text>
          </View>

          <AccordionSection
            styles={styles}
            title="Befunde"
            isOpen={sectionsOpen.findings}
            onPress={() => toggleSection("findings")}
          >
            {activeStep.findings.map((finding) => (
              <View key={finding} style={styles.listRow}>
                <Text style={styles.listText}>{de(finding)}</Text>
              </View>
            ))}
          </AccordionSection>

          <View
            style={[styles.sectionCard, IOS_CONTINUOUS]}
            onLayout={(event) => {
              const quizY = event.nativeEvent.layout.y;
              setAnchors((current) => ({
                ...current,
                quiz: quizY
              }));
            }}
          >
            <Text style={styles.sectionTitle}>Quiz</Text>
            <Text style={styles.questionText}>{de(activeStep.question.text)}</Text>

            {activeStep.question.options.map((option, index) => {
              const selected = index === selectedAnswerIndex;
              const showCorrect = hasAnsweredCurrentStep && option.correct;
              const showIncorrect =
                hasAnsweredCurrentStep && selected && !option.correct;

                return (
                  <Pressable
                    key={option.label}
                  onPress={() => handleAnswer(index)}
                  disabled={hasAnsweredCurrentStep || activeProgress.completed}
                  style={[
                    styles.answerButton,
                    IOS_CONTINUOUS,
                    showCorrect && styles.answerButtonCorrect,
                    showIncorrect && styles.answerButtonIncorrect
                  ]}
                >
                  <View style={styles.answerRow}>
                    <Text style={styles.answerText}>{de(option.label)}</Text>
                    {showCorrect ? (
                      <Text style={[styles.answerStateLabel, styles.answerStateCorrect]}>
                        Richtig
                      </Text>
                    ) : null}
                    {showIncorrect ? (
                      <Text style={[styles.answerStateLabel, styles.answerStateIncorrect]}>
                        Nicht optimal
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}

            {selectedAnswer ? (
              <View style={[styles.feedbackBox, IOS_CONTINUOUS]}>
                <Text style={styles.feedbackText}>
                  {de(selectedAnswer.rationale)}
                </Text>
              </View>
            ) : null}
          </View>

          <AccordionSection
            styles={styles}
            title="Lernhilfen"
            isOpen={sectionsOpen.resources}
            onPress={() => toggleSection("resources")}
          >
            {[...activeCase.resources, ...activeStep.cheatSheet].map((item) => (
              <View key={item} style={styles.listRowMuted}>
                <Text style={styles.listText}>{de(item)}</Text>
              </View>
            ))}
          </AccordionSection>

          {completedRuns.length > 0 ? (
            <View style={[styles.runHistoryCard, IOS_CONTINUOUS]}>
              <View style={styles.runHistoryHeader}>
                <View style={styles.runHistoryCopy}>
                  <Text style={styles.runHistoryTitle}>
                    {allCasesCompleted ? "Dein Lauf" : "Lokale Bestenliste"}
                  </Text>
                  <Text style={styles.runHistoryMeta}>
                    {allCasesCompleted
                      ? `${totalScore}/${totalPossibleScore} Punkte${
                          latestRunRank > 0
                            ? ` · Rang ${latestRunRank}/${localLeaderboard.length}`
                            : ""
                        }`
                      : bestLocalRun
                        ? `Bester Lauf ${bestLocalRun.score}/${totalPossibleScore} Punkte`
                        : ""}
                  </Text>
                </View>
                {allCasesCompleted ? (
                  <SecondaryButton
                    styles={styles}
                    compact
                    label="Neu starten"
                    onPress={handleRestartRun}
                  />
                ) : null}
              </View>

              <View style={styles.leaderboardList}>
                {localLeaderboard.slice(0, 5).map((entry, index) => {
                  const isLatest = entry.id === latestRunId;

                  return (
                    <View
                      key={entry.id}
                      style={[
                        styles.leaderboardRow,
                        IOS_CONTINUOUS,
                        isLatest && styles.leaderboardRowActive
                      ]}
                    >
                      <Text style={styles.leaderboardRank}>{index + 1}</Text>
                      <Text style={styles.leaderboardLabel}>{entry.label}</Text>
                      <Text style={styles.leaderboardScore}>
                        {entry.score}/{totalPossibleScore}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
          </Animated.ScrollView>
        </View>
      </View>

      <View style={styles.footerSafeArea}>
        <View
          style={[styles.bottomBarShell, { paddingBottom: bottomDockInset }]}
        >
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarContent}>
              <View style={styles.bottomMeta}>
                <Text style={styles.bottomMetaLabel}>{bottomMetaLabel}</Text>
                <Text style={styles.bottomMetaTitle}>{bottomMetaTitle}</Text>
              </View>
              {activeProgress.completed ? (
                <View style={[styles.bottomStatusBadge, IOS_CONTINUOUS]}>
                  <Text style={styles.bottomStatusBadgeText}>Abgeschlossen</Text>
                </View>
              ) : bottomAction ? (
                <Pressable
                  onPress={bottomAction.onPress}
                  disabled={bottomAction.disabled}
                  style={[
                    styles.bottomActionButton,
                    IOS_CONTINUOUS,
                    bottomAction.disabled && styles.bottomActionButtonDisabled
                  ]}
                >
                  <Text
                    style={[
                      styles.bottomActionText,
                      bottomAction.disabled && styles.bottomActionTextDisabled
                    ]}
                  >
                    {bottomAction.label}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function SectionHeader({ eyebrow, title, actionLabel, onPress, styles }) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
      {actionLabel ? (
        <SecondaryButton
          styles={styles}
          compact
          quiet
          label={actionLabel}
          onPress={onPress}
        />
      ) : null}
    </View>
  );
}

function AccordionSection({ title, isOpen, onPress, children, styles }) {
  return (
    <View style={[styles.sectionCard, IOS_CONTINUOUS]}>
      <Pressable onPress={onPress} style={styles.accordionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.accordionAction}>{isOpen ? "Weniger" : "Mehr"}</Text>
      </Pressable>
      {isOpen ? <View style={styles.accordionBody}>{children}</View> : null}
    </View>
  );
}

function InfoCell({ label, value, styles }) {
  return (
    <View style={[styles.infoCell, IOS_CONTINUOUS]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function MetricPill({ label, value, styles }) {
  return (
    <View style={[styles.metricPill, IOS_CONTINUOUS]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function PrimaryButton({ label, onPress, styles }) {
  return (
    <Pressable onPress={onPress} style={[styles.primaryButton, IOS_CONTINUOUS]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress, compact = false, quiet = false, styles }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.secondaryButton,
        IOS_CONTINUOUS,
        compact && styles.secondaryButtonCompact,
        quiet && styles.secondaryButtonQuiet
      ]}
    >
      <Text
        style={[
          styles.secondaryButtonText,
          quiet && styles.secondaryButtonTextQuiet
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function getBottomAction({
  hasAnsweredCurrentStep,
  activeProgress,
  activeCase,
  handleScrollToQuiz,
  handleNextStep,
  handleFinishCase
}) {
  if (activeProgress.completed) {
    return null;
  }

  if (!hasAnsweredCurrentStep) {
    return {
      label: "Antwort wählen",
      onPress: handleScrollToQuiz,
      disabled: false
    };
  }

  if (activeProgress.activeStepIndex < activeCase.steps.length - 1) {
    return {
      label: "Nächsten Schritt",
      onPress: handleNextStep,
      disabled: false
    };
  }

  return {
    label: "Fall abschließen",
    onPress: handleFinishCase,
    disabled: false
  };
}

function getProgress(progressByCase, caseId) {
  return progressByCase[caseId] ?? createEmptyProgress();
}

function getScoreForCase(caseItem, progress) {
  return Object.entries(progress.answers).reduce((sum, [stepIndex, answerIndex]) => {
    const step = caseItem.steps[Number(stepIndex)];
    const option = step?.question.options[Number(answerIndex)];
    return sum + (option?.points ?? 0);
  }, 0);
}

function getMaxScoreForCase(caseItem) {
  return caseItem.steps.reduce((sum, step) => {
    const stepMax = Math.max(...step.question.options.map((option) => option.points));
    return sum + stepMax;
  }, 0);
}

function getTotalScore(progressByCase) {
  return CASE_LIBRARY.reduce(
    (sum, caseItem) =>
      sum + getScoreForCase(caseItem, getProgress(progressByCase, caseItem.id)),
    0
  );
}

function getTotalPossibleScore() {
  return CASE_LIBRARY.reduce((sum, caseItem) => sum + getMaxScoreForCase(caseItem), 0);
}

function getOrderedCases(caseOrder) {
  return caseOrder
    .map((caseId) => CASE_LIBRARY.find((caseItem) => caseItem.id === caseId))
    .filter(Boolean);
}

function shuffleCaseIds() {
  const nextOrder = [...CASE_LIBRARY.map((caseItem) => caseItem.id)];

  for (let index = nextOrder.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextOrder[index], nextOrder[swapIndex]] = [nextOrder[swapIndex], nextOrder[index]];
  }

  return nextOrder;
}

function getCompletionLabel(progress) {
  if (progress.completed) return "Abgeschlossen";
  if (Object.keys(progress.answers).length > 0) return "In Arbeit";
  return "Neu";
}

function createStyles(theme) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.bg
  },
  footerSafeArea: {
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.lineSoft
  },
  appShell: {
    flex: 1
  },
  screen: {
    flex: 1
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 12,
    gap: 18
  },
  contentCompact: {
    paddingHorizontal: 14
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1
  },
  topBarWrap: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 18,
    backgroundColor: theme.bg
  },
  brandLabel: {
    color: theme.ink,
    fontSize: 18,
    fontWeight: "700"
  },
  headerMeta: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: theme.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden"
  },
  summaryCard: {
    backgroundColor: theme.surface,
    borderRadius: RADIUS_OUTER_MD,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.lineSoft
  },
  summaryCopy: {
    gap: 8
  },
  summaryEyebrow: {
    color: theme.accent,
    fontSize: 11,
    fontWeight: "600"
  },
  summaryTitle: {
    color: theme.ink,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700"
  },
  summaryMeta: {
    color: theme.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600"
  },
  summaryMetricGrid: {
    flexDirection: "row",
    gap: 8
  },
  metricPill: {
    flex: 1,
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_INNER_MD,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3
  },
  metricLabel: {
    color: theme.muted,
    fontSize: 11,
    fontWeight: "600"
  },
  metricValue: {
    color: theme.ink,
    fontSize: 15,
    fontWeight: "700"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    marginTop: 2
  },
  sectionEyebrow: {
    color: theme.accent,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4
  },
  sectionHeaderTitle: {
    color: theme.ink,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700"
  },
  libraryViewport: {
    marginHorizontal: -16
  },
  libraryViewportCompact: {
    marginHorizontal: -14
  },
  libraryScroller: {
    overflow: "visible"
  },
  libraryScroll: {
    gap: 10,
    paddingHorizontal: 16,
    paddingRight: 28
  },
  libraryScrollCompact: {
    paddingHorizontal: 14,
    paddingRight: 24
  },
  libraryCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.lineSoft
  },
  libraryCardCompleted: {
    backgroundColor: theme.correctSurface,
    borderColor: theme.correctBorder
  },
  libraryCardActive: {
    backgroundColor: theme.cardActive,
    shadowColor: theme.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6
    },
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.correctBorder
  },
  libraryCardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  libraryDomain: {
    color: theme.accent,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.1
  },
  libraryTitle: {
    color: theme.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700"
  },
  libraryMeta: {
    color: theme.muted,
    fontSize: 13
  },
  libraryStatusBadge: {
    backgroundColor: theme.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  libraryStatusBadgeText: {
    color: theme.accentText,
    fontSize: 11,
    fontWeight: "700"
  },
  sectionCard: {
    backgroundColor: theme.surface,
    borderRadius: RADIUS_OUTER_MD,
    padding: 18,
    gap: 12
  },
  sectionHeaderRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8
  },
  sectionHeaderCopy: {
    alignSelf: "stretch",
    gap: 8
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: theme.accentSoft,
    color: theme.accent,
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden"
  },
  modelMeta: {
    color: theme.accent,
    fontSize: 12,
    flexShrink: 0
  },
  caseMetaLine: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18
  },
  sectionTitleLarge: {
    color: theme.ink,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700"
  },
  sectionTitle: {
    color: theme.ink,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "700"
  },
  bodyText: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20
  },
  infoStack: {
    gap: 2
  },
  inlineBlock: {
    gap: 8
  },
  inlineLabel: {
    color: theme.muted,
    fontSize: 12,
    fontWeight: "600"
  },
  infoCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.line
  },
  infoLabel: {
    color: theme.muted,
    fontSize: 12
  },
  infoValue: {
    color: theme.ink,
    fontSize: 14,
    fontWeight: "600"
  },
  goalList: {
    gap: 8
  },
  goalChip: {
    borderLeftWidth: 2,
    borderLeftColor: theme.correctBorder,
    paddingLeft: 10,
    paddingVertical: 2
  },
  goalText: {
    color: theme.ink,
    fontSize: 13,
    lineHeight: 18
  },
  actionStack: {
    gap: 8
  },
  primaryButton: {
    backgroundColor: theme.ink,
    borderRadius: RADIUS_INNER_MD,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: theme.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4
    },
    elevation: 2
  },
  primaryButtonText: {
    color: theme.surface,
    fontSize: 15,
    fontWeight: "700"
  },
  secondaryButton: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_INNER_MD,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.line
  },
  secondaryButtonCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  secondaryButtonQuiet: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0
  },
  secondaryButtonText: {
    color: theme.ink,
    fontSize: 14,
    fontWeight: "600"
  },
  secondaryButtonTextQuiet: {
    color: theme.muted,
    fontSize: 13,
    fontWeight: "500"
  },
  progressTrack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: theme.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.progressIdle
  },
  progressDotDone: {
    backgroundColor: theme.accent
  },
  progressDotCurrent: {
    backgroundColor: theme.ink
  },
  progressLabel: {
    color: theme.ink,
    fontSize: 13,
    fontWeight: "600"
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  accordionAction: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "600"
  },
  accordionBody: {
    gap: 10,
    minWidth: 0,
    alignItems: "stretch"
  },
  listRow: {
    width: "100%",
    paddingVertical: 6,
    paddingRight: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: theme.line
  },
  listRowMuted: {
    width: "100%",
    paddingVertical: 6,
    paddingRight: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: theme.correctBorder
  },
  listText: {
    color: theme.ink,
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    flexBasis: "auto"
  },
  questionText: {
    color: theme.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600"
  },
  answerButton: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_INNER_MD,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.line,
    shadowColor: theme.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2
    },
    elevation: 1
  },
  answerButtonCorrect: {
    backgroundColor: theme.correctSurface,
    borderColor: theme.correctBorder
  },
  answerButtonIncorrect: {
    backgroundColor: theme.incorrectSurface,
    borderColor: theme.incorrectBorder
  },
  answerText: {
    color: theme.ink,
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  answerStateLabel: {
    fontSize: 12,
    fontWeight: "700"
  },
  answerStateCorrect: {
    color: theme.accentText
  },
  answerStateIncorrect: {
    color: theme.danger
  },
  feedbackBox: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_INNER_MD,
    padding: 14
  },
  feedbackText: {
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20
  },
  runHistoryCard: {
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_OUTER_MD,
    padding: 16,
    gap: 12
  },
  runHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  runHistoryCopy: {
    flex: 1,
    gap: 4
  },
  runHistoryTitle: {
    color: theme.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  runHistoryMeta: {
    color: theme.muted,
    fontSize: 13,
    lineHeight: 18
  },
  leaderboardList: {
    gap: 8
  },
  leaderboardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.surfaceMuted,
    borderRadius: RADIUS_INNER_MD,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  leaderboardRowActive: {
    backgroundColor: theme.correctSurface,
    borderWidth: 1,
    borderColor: theme.correctBorder
  },
  leaderboardRank: {
    color: theme.accent,
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20
  },
  leaderboardLabel: {
    color: theme.ink,
    fontSize: 14,
    fontWeight: "600",
    flex: 1
  },
  leaderboardScore: {
    color: theme.ink,
    fontSize: 14,
    fontWeight: "700"
  },
  bottomBarShell: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
  bottomBar: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  bottomMeta: {
    flex: 1,
    gap: 2
  },
  bottomMetaLabel: {
    color: theme.muted,
    fontSize: 12,
    marginBottom: 1
  },
  bottomMetaTitle: {
    color: theme.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  bottomActionButton: {
    backgroundColor: theme.ink,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 146,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.lineSoft
  },
  bottomActionButtonDisabled: {
    backgroundColor: theme.surfaceMuted,
    borderColor: theme.line
  },
  bottomStatusBadge: {
    backgroundColor: theme.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  bottomStatusBadgeText: {
    color: theme.accentText,
    fontSize: 12,
    fontWeight: "700"
  },
  bottomActionText: {
    color: theme.surface,
    fontSize: 14,
    fontWeight: "700"
  },
  bottomActionTextDisabled: {
    color: theme.muted
  }
  });
}
