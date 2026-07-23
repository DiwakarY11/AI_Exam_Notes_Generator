import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
        dispatch(setUserData(result.data))
        return result.data
    } catch (error) {
        console.log("getCurrentUser error:", error)
        dispatch(setUserData(null))
        return null
    }
}

export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(serverUrl+ "/api/notes/generate-notes" , payload , {withCredentials:true})
        console.log(result.data)
        return result.data

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const verifyPayment = async (sessionId, dispatch) => {
    try {
        const response = await axios.post(serverUrl + "/api/credit/verify-payment", { session_id: sessionId }, { withCredentials: true });
        if (response.data?.user) {
            dispatch(setUserData(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error("Payment verification failed:", error);
        throw error;
    }
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl+ "/api/pdf/generate-pdf" , {result} , {
            responseType:"blob" , withCredentials:true
        })

        const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
    } catch (error) {
         throw new Error("PDF download failed");

    }
}