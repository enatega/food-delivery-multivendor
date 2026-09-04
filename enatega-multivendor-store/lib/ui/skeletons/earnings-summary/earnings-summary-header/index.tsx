import { useEarningsTheme } from "@/lib/ui/screen-components/earnings/theme";
import { MotiText, MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useTranslation } from "react-i18next";

export default function EarningSummaryHeader() {
  const earningsTheme = useEarningsTheme();
  const { t } = useTranslation();
  const skeletonProps = {
    backgroundColor: earningsTheme.skeletonBase,
    colors: [
      earningsTheme.skeletonBase,
      earningsTheme.skeletonHighlight,
      earningsTheme.skeletonBase,
    ],
  };

  return (
    <MotiView style={{ paddingBottom: 22 }}>
      <Skeleton height={42} radius={10} width={148} {...skeletonProps} />
      <MotiText
        style={{
          color: earningsTheme.primaryText,
          fontSize: 20,
          fontWeight: "800",
          marginBottom: 12,
          marginTop: 22,
        }}
      >
        {t("Summary")}
      </MotiText>
      <MotiView
        style={{
          backgroundColor: earningsTheme.surfaceRaised,
          borderRadius: 12,
          flexDirection: "row",
          minHeight: 146,
          padding: 18,
        }}
      >
        {[0, 1].map((index) => (
          <MotiView
            key={index}
            style={{
              flex: 1,
              gap: 10,
              paddingEnd: index === 0 ? 10 : 0,
              paddingStart: index === 0 ? 0 : 10,
            }}
          >
            <Skeleton height={34} radius={9} width={34} {...skeletonProps} />
            <Skeleton height={13} radius={4} width="78%" {...skeletonProps} />
            <Skeleton height={23} radius={6} width="88%" {...skeletonProps} />
          </MotiView>
        ))}
      </MotiView>
    </MotiView>
  );
}
