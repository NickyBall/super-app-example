//
//  ContentView.swift
//  SuperApp
//
//  Created by Jakkrit Junrat on 17/1/2569 BE.
//

import SwiftUI

struct ContentView: View {
    @State private var currentApp: String = "app1"
    @State private var alertMessage: String?

    var body: some View {
        VStack(spacing: 0) {
            // Header with app buttons
            HStack(spacing: 16) {
                Button("Shopping App") {
                    currentApp = "app1"
                }
                .buttonStyle(MiniAppButtonStyle())

                Button("Payment App") {
                    currentApp = "app2"
                }
                .buttonStyle(MiniAppButtonStyle())
            }
            .padding()
            .background(Color.gray.opacity(0.1))

            // WebView container
            MiniAppWebViewContainer(appName: currentApp, alertMessage: $alertMessage)
        }
        .navigationTitle("SuperApp")
        .alert("Mini App", isPresented: .constant(alertMessage != nil), presenting: alertMessage) { _ in
            Button("OK") {
                alertMessage = nil
            }
        } message: { message in
            Text(message)
        }
    }
}

struct MiniAppButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
    }
}

#Preview {
    ContentView()
}
