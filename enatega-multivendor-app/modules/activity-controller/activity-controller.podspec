Pod::Spec.new do |s|
  s.name         = "activity-controller"
  s.version      = "1.0.0"
  s.summary      = "Live Activities module"
  s.homepage     = "https://github.com/enatega/activity-controller"
  s.license      = "MIT"
  s.author       = "Enatega"

  s.source       = { :path => "." }
  s.platform     = :ios, "13.0"
  s.swift_version = "5.0"

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.dependency "React-Core"
end
