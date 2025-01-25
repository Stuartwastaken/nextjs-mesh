import React from "react";
import Image from "next/image";
import styles from "./AcceptReferral.module.css";

export default function AcceptReferral() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>How it works</h2>
      <div className={styles.steps}>
        {/* Step 1 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <p>Download the app by clicking these links:</p>
            <div className={styles.storeLinks}>
              <div className={styles.imgWrapper}>
                <a
                  href="https://apps.apple.com/us/app/mesh-four-people-together/id6446823257"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/app_store_logo.png"
                    alt="Download on the App Store"
                    width={200}
                    height={60}
                    className={styles.croppedImage}
                  />
                </a>
              </div>
              <div className={styles.imgWrapper}>
                <a
                  href="https://play.google.com/store/apps/details?id=com.mycompany.mesh&hl=en_US&gl=US&pli=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/google_play_logo.png"
                    alt="Get it on Google Play"
                    width={200}
                    height={60}
                    className={styles.croppedImage}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <p>Create an account</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <p>Click the referral link again to redeem rewards!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
