import React from "react";
import styles from "./ReferAFriend.module.css";
import { Poppins } from "next/font/google";
const poppins = Poppins({ weight: ["400", "600"], subsets: ["latin"] });

export default function ReferAFriend() {
  // When the button is clicked, open the app using the referAFriend deep link.
  const handleClick = () => {
    window.location.href = "mesh://meshapp.us/referAFriend";
  };

  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <h2 className={styles.heading}>Refer a Friend</h2>
      <p className={styles.message}>
        Refer people in app to get free Mesh for life!
      </p>
      <button className={styles.actionButton} onClick={handleClick}>
        Click here!
      </button>
    </div>
  );
}
