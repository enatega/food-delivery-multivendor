#!/bin/zsh
#
# Free nightly runner for the read-only iOS suites, scheduled by launchd on a
# Mac rather than by GitHub Actions.
#
# Why not CI: the customer QA app has to be BUILT before Maestro can drive it,
# and that build needs the `Pods/fmt/include/fmt/base.h` patch that
# `expo prebuild` throws away every time (see MOBILE-IOS.md). A hosted runner
# would rebuild from scratch nightly and go red on the toolchain, not on the
# app. This runs against the simulator and the build that already work here.
#
# What it runs: smoke, regression and navigation — all production READ-ONLY.
# It never runs production-order or the customer/store/rider E2E, because both
# place a real COD order on production and nothing should do that unattended.
#
# Each suite posts its own pass/fail card to Slack via run-with-slack.js and
# keeps its own exit code, so a red suite is visible in Slack and in the log.

set -uo pipefail

QA_DIR="/Users/ninjascode5/Documents/Enatega_Testing/food-delivery-multivendor/qa-automation"
APP_BUNDLE="/Users/ninjascode5/Documents/Enatega_Testing/food-delivery-multivendor/enatega-multivendor-app/ios/build/ddata/Build/Products/Release-iphonesimulator/EnategaQAPROD.app"
SIMULATOR="iPhone 17 Pro"
APP_ID="com.enatega.multivendor.qa"
LOG_DIR="$QA_DIR/reports/nightly"

# Homebrew's JDK is not on the default PATH, and Maestro exits with
# "Unable to locate a Java Runtime" without it. launchd gives an even barer
# environment than an interactive shell, so both are set explicitly.
export PATH="/opt/homebrew/opt/openjdk@17/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

cd "$QA_DIR" || exit 1
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/mobile-$(date +%Y%m%d-%H%M%S).log"
exec >>"$LOG" 2>&1

echo "=== nightly mobile run started $(date -Iseconds) ==="

# A second run on the same simulator would fight the first for the device.
LOCK="$LOG_DIR/.mobile.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "another nightly run holds $LOCK — exiting"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

# SLACK_WEBHOOK_URL lives in .env; the QA fixtures live in .env.mobile.local.
# The runner loads .env.mobile.local itself, so only the webhook is needed here.
if [[ -f .env ]]; then
  set -a; source .env; set +a
fi

# `booted` is ambiguous when several simulators are up and resolves to an
# arbitrary one — a run can then look for the app on a device that never had it.
# Shut the extras down so `booted` means this device.
# resolve-simulator.py, not a name grep: simctl lists one "iPhone 17 Pro" per
# installed runtime, so `head -1` can return the iOS 26.3 device while the one
# holding the app is on 26.5 — which would shut down the prepared device and
# reinstall on the wrong one.
BOOTED=$(xcrun simctl list devices booted | grep -oE '[0-9A-F]{8}-[0-9A-F-]{27}')
TARGET=$(python3 "$QA_DIR/scripts/resolve-simulator.py" "$SIMULATOR") || TARGET=""
if [[ -z "$TARGET" ]]; then
  echo "FATAL: simulator '$SIMULATOR' not available"
  exit 1
fi
echo "target simulator: $TARGET"
for udid in ${(f)BOOTED}; do
  if [[ "$udid" != "$TARGET" ]]; then
    echo "shutting down extra simulator $udid"
    xcrun simctl shutdown "$udid" || true
  fi
done
if ! echo "$BOOTED" | grep -q "$TARGET"; then
  echo "booting $SIMULATOR ($TARGET)"
  xcrun simctl boot "$TARGET" || true
  sleep 20
fi

# Reinstall only when the app is missing: a normal night should not pay for it.
if ! xcrun simctl get_app_container "$TARGET" "$APP_ID" >/dev/null 2>&1; then
  echo "installing $APP_ID from $APP_BUNDLE"
  if [[ ! -d "$APP_BUNDLE" ]]; then
    echo "FATAL: no built app at $APP_BUNDLE — rebuild per MOBILE-IOS.md"
    exit 1
  fi
  xcrun simctl install "$TARGET" "$APP_BUNDLE" || exit 1
fi

if ! npm run mobile:preflight:ios; then
  echo "FATAL: preflight failed — suites skipped"
  node scripts/slack-report.js \
    --junit "reports/maestro/nonexistent/junit.xml" \
    --title 'iOS nightly — preflight failed, no suite ran' \
    --command 'npm run mobile:preflight:ios' || true
  exit 1
fi

STATUS=0
for suite in mobile:smoke mobile:regression mobile:navigation; do
  echo "--- $suite ---"
  npm run "slack:$suite" || STATUS=1
done

echo "=== finished $(date -Iseconds) with status $STATUS ==="

# Keep a fortnight of logs, matching the CI artifact retention.
find "$LOG_DIR" -name 'mobile-*.log' -mtime +14 -delete 2>/dev/null

exit $STATUS
