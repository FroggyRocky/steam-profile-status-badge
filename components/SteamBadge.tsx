import React from "react";
import { PlayerSummaryType, AdditionalPlayerSummaryType } from "../types";
import { SteamLogo } from "./SteamLogo";

type Props = {
  playerSummary: (PlayerSummaryType & AdditionalPlayerSummaryType) | undefined;
  message?: string;
};

const width = 540;
const height = 120;

const styles = {
  badgeContainer: {
    backgroundColor: "#171a21",
    color: "#ecf0f1",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    height: "max-content",
    width: "100%",
    borderRadius: "10px",
  },
  badgeContent: {
    display: "flex",
    padding: "10px 10px",
  },
  badgeSteamLogo: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 20,
  } as React.CSSProperties,
  badgeAvatar: {
    border: "2px solid #1b2838",
    width: "80px",
    height: "80px",
    boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
  },
  badgeProfile: {
    marginLeft: "20px",
  },
  badgeName: {
    fontSize: "24px",
    color: "#00adee",
    margin:0
  },
  badgeNameOffline: {
    color: "gray",
  },
  badgeStatus: {
    fontSize: "12px",
    color: "#00adee",
    fontWeight: 100,
    margin:0
  },
  badgeStatusOffline: {
    color: "gray",
  },
  badgeGameContainer: {
    marginTop: "15px",
  },
  badgeGameHeader: {
    color: "#b4e61d",
    margin:0
  },
  badgeGameName: {
    color: "#a4d007",
    opacity: 0.9,
    margin:0
  },
  badgeFallbackContent: {
    display: "flex",
    alignItems: "center",
    padding: "10px 10px",
    height: `${height - 20}px`,
    boxSizing: "border-box",
  } as React.CSSProperties,
  badgeFallbackText: {
    fontSize: "20px",
    color: "#b8b6b4",
    margin: 0,
  },
}

export function SteamBadge(props: Props) {
  if (!props.playerSummary) {
    return (
      <svg
        fill="none"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject width={width} height={height}>
          <main {...{ xmlns: "http://www.w3.org/1999/xhtml" }} style={styles.badgeContainer}>
            <aside style={styles.badgeSteamLogo}>
              <SteamLogo />
            </aside>
            <div style={styles.badgeFallbackContent}>
              <p style={styles.badgeFallbackText}>
                {props.message ?? "Player not found"}
              </p>
            </div>
          </main>
        </foreignObject>
      </svg>
    );
  }
  return (
    <svg
      fill="none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject width={width} height={height}>
        <main {...{ xmlns: "http://www.w3.org/1999/xhtml" }} style={styles.badgeContainer}>
          <aside style={styles.badgeSteamLogo}>
            <SteamLogo />
          </aside>
          <div style={styles.badgeContent}>
            {props.playerSummary.profileImageBase64 && (
              <img
                style={styles.badgeAvatar}
                src={props.playerSummary.profileImageBase64}
                alt={"avatar"}
              />
            )}
            <aside style={styles.badgeProfile}>
              <p
                style={{
                  ...styles.badgeName,
                  ...(props.playerSummary.status === "Offline" && styles.badgeNameOffline),
                }}
              >
                {props.playerSummary.personaname}
              </p>
              {props.playerSummary.status &&
                !props.playerSummary.gameextrainfo && (
                  <p
                    style={{
                      ...styles.badgeStatus,
                      ...(props.playerSummary.status === "Offline" && styles.badgeStatusOffline),
                    }}
                  >
                    {props.playerSummary.status}
                  </p>
                )}
              {props.playerSummary.gameextrainfo && (
                <div style={styles.badgeGameContainer}>
                  <p style={styles.badgeGameHeader}>In Game:</p>
                  <p style={styles.badgeGameName}>
                    {props.playerSummary.gameextrainfo}
                  </p>
                </div>
              )}
            </aside>
          </div>
        </main>
      </foreignObject>
    </svg>
  );
}