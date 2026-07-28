import ActivityKit
import WidgetKit
import SwiftUI

private let enategaGreen = Color(red: 0.56, green: 0.89, blue: 0.43)
private let enategaAccent = Color(red: 1.0, green: 0.66, blue: 0.13)
private let enategaNavy = Color(red: 0.04, green: 0.07, blue: 0.15)
private let muted = Color(red: 0.43, green: 0.44, blue: 0.47)

private func trackingURL(orderId: String, courierChat: Bool = false) -> URL? {
  var components = URLComponents()
  components.scheme = "enategamultivendor"
  components.host = "order-tracking"
  components.queryItems = [URLQueryItem(name: "id", value: orderId)]
  if courierChat {
    components.queryItems?.append(URLQueryItem(name: "chat", value: "courier"))
  }
  return components.url
}

private func riderCallURL(phone: String) -> URL? {
  let trimmedPhone = phone.trimmingCharacters(in: .whitespacesAndNewlines)
  guard !trimmedPhone.isEmpty else { return nil }

  var components = URLComponents()
  components.scheme = "enategamultivendor"
  components.host = "call-rider"
  components.queryItems = [URLQueryItem(name: "phone", value: trimmedPhone)]
  return components.url
}

private enum DeliveryStage: Int, CaseIterable {
  case pending, accepted, assigned, picked, delivered

  init(status: String) {
    switch status.uppercased() {
    case "ACCEPTED": self = .accepted
    case "ASSIGNED": self = .assigned
    case "PICKED": self = .picked
    case "DELIVERED", "COMPLETED": self = .delivered
    default: self = .pending
    }
  }

  var icon: String {
    switch self {
    case .pending: return "clock.fill"
    case .accepted: return "checkmark"
    case .assigned: return "scooter"
    case .picked: return "shippingbox.fill"
    case .delivered: return "house.fill"
    }
  }
}

private struct ActivityCopy {
  let language: String

  var isRTL: Bool { language == "ar" || language == "he" }

  func stage(_ stage: DeliveryStage) -> String {
    let values: [String: [String]] = [
      "en": ["Pending", "Accepted", "Assigned", "Picked", "Delivered"],
      "ar": ["قيد الانتظار", "مقبول", "تم التعيين", "تم الاستلام", "تم التوصيل"],
      "he": ["בהמתנה", "אושר", "שויך", "נאסף", "נמסר"],
    ]
    return (values[language] ?? values["en"]!)[stage.rawValue]
  }

  func headline(_ status: String) -> String {
    let key = status.uppercased()
    let values: [String: [String: String]] = [
      "en": ["PENDING": "Order received", "ACCEPTED": "Preparing your order", "ASSIGNED": "Rider assigned", "PICKED": "Almost here!", "DELIVERED": "Delivered!", "COMPLETED": "Delivered!", "CANCELLED": "Order cancelled", "CANCELLEDBYREST": "Order cancelled"],
      "ar": ["PENDING": "تم استلام الطلب", "ACCEPTED": "يتم تحضير طلبك", "ASSIGNED": "تم تعيين السائق", "PICKED": "اقتربنا!", "DELIVERED": "تم التوصيل!", "COMPLETED": "تم التوصيل!", "CANCELLED": "تم إلغاء الطلب", "CANCELLEDBYREST": "تم إلغاء الطلب"],
      "he": ["PENDING": "ההזמנה התקבלה", "ACCEPTED": "מכינים את ההזמנה", "ASSIGNED": "שליח שויך", "PICKED": "כמעט הגענו!", "DELIVERED": "נמסר!", "COMPLETED": "נמסר!", "CANCELLED": "ההזמנה בוטלה", "CANCELLEDBYREST": "ההזמנה בוטלה"],
    ]
    return values[language]?[key] ?? values["en"]?[key] ?? "Order update"
  }

  var arrivingAt: String { language == "ar" ? "الوصول في" : language == "he" ? "הגעה בשעה" : "Arriving at" }
  var meet: String { language == "ar" ? "تعرّف على" : language == "he" ? "הכירו את" : "Meet" }
  var yourRider: String { language == "ar" ? "السائق الخاص بك" : language == "he" ? "השליח שלך" : "Your rider" }

}

private extension DeliveryAttributes.ContentState {
  var stage: DeliveryStage { DeliveryStage(status: status) }
  var copy: ActivityCopy { ActivityCopy(language: ["ar", "he"].contains(language) ? language : "en") }
  var isCancelled: Bool { status.uppercased().contains("CANCEL") }
  var isTerminal: Bool { isCancelled || ["DELIVERED", "COMPLETED"].contains(status.uppercased()) }
  var hasRider: Bool { !riderName.isEmpty && stage.rawValue >= DeliveryStage.assigned.rawValue }
  var arrivalDate: Date? { estimatedArrivalEpoch > 0 ? Date(timeIntervalSince1970: TimeInterval(estimatedArrivalEpoch)) : nil }
  var etaStartDate: Date { Date(timeIntervalSince1970: TimeInterval(etaUpdatedAtEpoch)) }
  var showsETA: Bool {
    stage == .picked && !riderName.isEmpty && !isTerminal && estimatedArrivalEpoch > 0
  }
}

private struct EnategaLogo: View {
  var compact = false

  var body: some View {
    Image("EnategaLogo")
      .resizable()
      .scaledToFill()
      .frame(width: compact ? 76 : 112, height: compact ? 24 : 32, alignment: .leading)
      .clipped()
      .accessibilityLabel("Enatega")
  }
}

private struct EtaView: View {
  let state: DeliveryAttributes.ContentState
  var compact = false

  private func remainingProgress(until arrival: Date, at date: Date) -> Double {
    let rawStart = state.etaStartDate
    let start = rawStart < arrival ? rawStart : arrival.addingTimeInterval(-60)
    let duration = max(arrival.timeIntervalSince(start), 60)
    return min(max(arrival.timeIntervalSince(date) / duration, 0), 1)
  }

  private func remainingMinutes(until arrival: Date, at date: Date) -> Int {
    max(Int(ceil(arrival.timeIntervalSince(date) / 60)), 0)
  }

  var body: some View {
    if state.showsETA, let arrival = state.arrivalDate {
      TimelineView(.everyMinute) { timeline in
        let minutes = remainingMinutes(until: arrival, at: timeline.date)
        if compact {
          Text("\(minutes)m")
            .font(.system(size: 11, weight: .bold, design: .rounded))
            .monospacedDigit()
            .lineLimit(1)
        } else {
          HStack(spacing: 6) {
            Text("\(minutes)m")
              .font(.system(size: 12, weight: .bold, design: .rounded))
              .monospacedDigit()
              .lineLimit(1)
            ZStack {
              Circle()
                .stroke(muted.opacity(0.5), lineWidth: 4)
              Circle()
                .trim(from: 0, to: remainingProgress(until: arrival, at: timeline.date))
                .stroke(enategaAccent, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                .rotationEffect(.degrees(-90))
            }
            .frame(width: 27, height: 27)
          }
          .fixedSize(horizontal: true, vertical: false)
        }
      }
    }
  }
}

private struct StageTimeline: View {
  let state: DeliveryAttributes.ContentState
  var compact = false

  private func color(for stage: DeliveryStage) -> Color {
    if state.isCancelled { return muted }
    if state.stage == .delivered { return enategaGreen }
    if stage.rawValue < state.stage.rawValue { return enategaGreen }
    if stage == state.stage { return enategaAccent }
    return muted
  }

  var body: some View {
    let circleSize: CGFloat = compact ? 24 : 36
    let iconSize: CGFloat = compact ? 8 : 12
    let labelSize: CGFloat = compact ? 8 : 10

    VStack(spacing: compact ? 3 : 6) {
      ZStack {
        GeometryReader { geometry in
          let railInset = circleSize / 2
          let railWidth = max(geometry.size.width - circleSize, 0)
          Capsule()
            .fill(muted.opacity(0.55))
            .frame(width: railWidth, height: compact ? 2 : 3)
            .offset(x: railInset, y: (circleSize / 2) - 1)
          if !state.isCancelled && state.stage.rawValue > 0 {
            Capsule()
              .fill(enategaGreen)
              .frame(
                width: railWidth * CGFloat(state.stage.rawValue) / CGFloat(DeliveryStage.allCases.count - 1),
                height: compact ? 2 : 3
              )
              .offset(x: railInset, y: (circleSize / 2) - 1)
          }
        }
        HStack(spacing: 0) {
          ForEach(Array(DeliveryStage.allCases.enumerated()), id: \.element.rawValue) { item in
            let stage = item.element
            ZStack {
              Circle()
                .fill(enategaNavy)
              Circle()
                .stroke(color(for: stage), lineWidth: stage == state.stage ? 3 : 2)
              if stage.rawValue < state.stage.rawValue && !state.isCancelled {
                Circle().fill(enategaGreen)
              }
              Image(systemName: stage.rawValue < state.stage.rawValue ? "checkmark" : stage.icon)
                .font(.system(size: iconSize, weight: .bold))
                .foregroundStyle(stage.rawValue < state.stage.rawValue && !state.isCancelled ? .black : color(for: stage))
            }
            .frame(width: circleSize, height: circleSize)
            if item.offset < DeliveryStage.allCases.count - 1 {
              Spacer(minLength: 0)
            }
          }
        }
      }
      .frame(height: circleSize)
      GeometryReader { geometry in
        let railInset = circleSize / 2
        let railWidth = max(geometry.size.width - circleSize, 0)
        ForEach(DeliveryStage.allCases, id: \.rawValue) { stage in
          Text(state.copy.stage(stage))
            .font(.system(size: labelSize, weight: stage == state.stage ? .semibold : .regular))
            .foregroundStyle(stage.rawValue <= state.stage.rawValue ? .white : muted)
            .lineLimit(1)
            .minimumScaleFactor(0.55)
            .frame(width: 60)
            .position(
              x: railInset + railWidth * CGFloat(stage.rawValue) / CGFloat(DeliveryStage.allCases.count - 1),
              y: labelSize / 2
            )
        }
      }
      .frame(height: labelSize)
    }
  }
}

private struct RiderPanel: View {
  let state: DeliveryAttributes.ContentState
  let orderId: String

  var body: some View {
    if state.hasRider {
      HStack(spacing: 8) {
        Image("EnategaRider")
          .renderingMode(.original)
          .resizable()
          .scaledToFit()
          .frame(width: 48, height: 50, alignment: .bottom)
        VStack(alignment: .leading, spacing: 2) {
          Text("\(state.copy.meet) \(state.riderName)")
            .font(.system(size: 12, weight: .semibold))
            .lineLimit(1)
          Text(state.copy.yourRider)
            .font(.system(size: 9, weight: .medium))
            .foregroundStyle(.secondary)
        }
        Spacer(minLength: 4)
        if let chatURL = trackingURL(orderId: orderId, courierChat: true) {
          Link(destination: chatURL) {
            Image(systemName: "message.fill")
              .font(.system(size: 12, weight: .semibold))
              .frame(width: 30, height: 30)
              .background(Circle().fill(Color.white.opacity(0.08)))
              .overlay(Circle().stroke(muted.opacity(0.7)))
          }.accessibilityLabel("Chat with rider")
        }
        if let callURL = riderCallURL(phone: state.riderPhone) {
          Link(destination: callURL) {
            Image(systemName: "phone.fill")
              .font(.system(size: 12, weight: .semibold))
              .frame(width: 30, height: 30)
              .background(Circle().fill(Color.white.opacity(0.08)))
              .overlay(Circle().stroke(muted.opacity(0.7)))
          }.accessibilityLabel("Call rider")
        }
      }
      .padding(.horizontal, 8)
      .padding(.top, 4)
      .background(RoundedRectangle(cornerRadius: 12).fill(Color.white.opacity(0.07)))
      .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.white.opacity(0.08)))
    }
  }
}

private struct LockScreenActivityView: View {
  let context: ActivityViewContext<DeliveryAttributes>

  var body: some View {
    let state = context.state
    VStack(spacing: state.hasRider ? 7 : 11) {
      HStack {
        EnategaLogo()
        Spacer()
        if state.showsETA {
          EtaView(state: state)
        } else {
          Text("#\(context.attributes.displayOrderId)")
            .font(.system(size: 12, weight: .semibold, design: .rounded))
            .foregroundStyle(.white.opacity(0.75))
            .lineLimit(1)
        }
      }
      StageTimeline(state: state, compact: state.hasRider)
        .padding(.horizontal, 4)
      if state.hasRider {
        RiderPanel(state: state, orderId: context.attributes.orderId)
      }
    }
    .environment(\.layoutDirection, state.copy.isRTL ? .rightToLeft : .leftToRight)
    .padding(.horizontal, 14)
    .padding(.top, 9)
    .padding(.bottom, 12)
    .foregroundStyle(.white)
    .activityBackgroundTint(enategaNavy)
    .activitySystemActionForegroundColor(.white)
    .widgetURL(trackingURL(orderId: context.attributes.orderId))
  }
}

struct WidgetLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DeliveryAttributes.self) { context in
      LockScreenActivityView(context: context)
    } dynamicIsland: { context in
      let state = context.state
      return DynamicIsland {
        DynamicIslandExpandedRegion(.leading) { EnategaLogo(compact: true) }
        DynamicIslandExpandedRegion(.trailing) {
          if state.showsETA {
            EtaView(state: state, compact: true)
          } else {
            Text("#\(context.attributes.displayOrderId)")
              .font(.caption2.weight(.medium))
              .foregroundStyle(muted)
          }
        }
        DynamicIslandExpandedRegion(.center) {
          Text(state.copy.headline(state.status)).font(.headline.bold()).foregroundStyle(state.isCancelled ? .red : .white).lineLimit(1)
        }
        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 8) {
            StageTimeline(state: state, compact: state.hasRider)
            RiderPanel(state: state, orderId: context.attributes.orderId)
          }.padding(.top, 4)
        }
      } compactLeading: {
        Image(systemName: "paperplane.fill").foregroundStyle(state.isCancelled ? .red : enategaGreen)
      } compactTrailing: {
        if state.showsETA {
          EtaView(state: state, compact: true)
        } else {
          Image(systemName: state.stage.icon).foregroundStyle(state.isCancelled ? .red : enategaAccent)
        }
      } minimal: {
        Image(systemName: "paperplane.fill").foregroundStyle(state.isCancelled ? .red : enategaGreen)
      }
      .keylineTint(enategaGreen)
      .widgetURL(trackingURL(orderId: context.attributes.orderId))
    }
  }
}

#if DEBUG
struct WidgetLiveActivityPreviews: PreviewProvider {
  private static let attributes = DeliveryAttributes(
    orderId: "507f1f77bcf86cd799439011",
    displayOrderId: "Y-2048"
  )

  private static func state(
    _ status: String,
    language: String = "en",
    riderName: String = "Dave",
    etaMinutes: Int? = 8,
    etaUpdatedOffset: Int64 = 0
  ) -> DeliveryAttributes.ContentState {
    let now = Int64(Date().timeIntervalSince1970)
    return DeliveryAttributes.ContentState(
      schemaVersion: 2,
      status: status,
      estimatedArrivalEpoch: etaMinutes.map { now + Int64($0 * 60) } ?? 0,
      etaUpdatedAtEpoch: now + etaUpdatedOffset,
      riderName: riderName,
      riderPhone: "+972500000000",
      language: language
    )
  }

  static var previews: some View {
    Group {
      attributes.previewContext(state("PENDING", riderName: ""), viewKind: .content)
        .previewDisplayName("Pending")
      attributes.previewContext(state("ACCEPTED", riderName: ""), viewKind: .content)
        .previewDisplayName("Accepted")
      attributes.previewContext(state("ASSIGNED"), viewKind: .content)
        .previewDisplayName("Assigned")
      attributes.previewContext(state("PICKED"), viewKind: .content)
        .previewDisplayName("Picked")
      attributes.previewContext(
        state("PICKED", etaMinutes: 3, etaUpdatedOffset: 10 * 60),
        viewKind: .content
      ).previewDisplayName("Picked Invalid ETA Range")
      attributes.previewContext(state("DELIVERED", etaMinutes: nil), viewKind: .content)
        .previewDisplayName("Delivered")
      attributes.previewContext(state("CANCELLED", etaMinutes: nil), viewKind: .content)
        .previewDisplayName("Cancelled")
      attributes.previewContext(
        state("PICKED", language: "ar", riderName: "عبد الرحمن محمد الطويل"),
        viewKind: .dynamicIsland(.expanded)
      ).previewDisplayName("Expanded Arabic")
      attributes.previewContext(
        state("ASSIGNED", language: "he", etaMinutes: nil),
        viewKind: .dynamicIsland(.compact)
      ).previewDisplayName("Compact Hebrew")
      attributes.previewContext(
        state("CANCELLED", etaMinutes: nil),
        viewKind: .dynamicIsland(.minimal)
      ).previewDisplayName("Minimal Cancelled")
    }
  }
}
#endif
