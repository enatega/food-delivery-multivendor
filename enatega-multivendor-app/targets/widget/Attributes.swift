import ActivityKit

public struct DeliveryAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    public var schemaVersion: Int
    public var status: String
    public var estimatedArrivalEpoch: Int64
    public var etaUpdatedAtEpoch: Int64
    public var riderName: String
    public var riderPhone: String
    public var language: String

    public init(
      schemaVersion: Int,
      status: String,
      estimatedArrivalEpoch: Int64,
      etaUpdatedAtEpoch: Int64,
      riderName: String,
      riderPhone: String,
      language: String
    ) {
      self.schemaVersion = schemaVersion
      self.status = status
      self.estimatedArrivalEpoch = estimatedArrivalEpoch
      self.etaUpdatedAtEpoch = etaUpdatedAtEpoch
      self.riderName = riderName
      self.riderPhone = riderPhone
      self.language = language
    }
  }

  public let orderId: String
  public let displayOrderId: String
}
