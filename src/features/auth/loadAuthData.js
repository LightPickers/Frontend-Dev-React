export default function loadAuthData() {
  try {
    const storedData = localStorage.getItem("auth");
    return storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error("auth localStorage parse error", err);
    return null;
  }
}

// {
// 	"status" : "true",
// 	"message" : "登入成功",
// 	"data": {
// 		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
// 		"user": {
// 			"name": "測試使用者",
// 			"photo": ""
// 		}
// 	}
// }
