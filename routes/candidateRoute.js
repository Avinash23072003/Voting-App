const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { generateToken, jwtAuthMiddleware } = require('../jwt');
const Candidate=require("../models/candidate")


//check admin hai kya nhi
const checkAdminRole=async(userID)=>{
   try{
    const user=await  User.findById(userID);
    return user.role=='Admin';
   }
   catch(err){
   return false;
   }
}
// POST-GET Method for person data
router.post('/',  jwtAuthMiddleware,async (req, res) => {
    try {
        if(!await checkAdminRole(req.user.id)){
              return res.status(403).json({message:"User has not admin role"});
            console.log("Admin role not found")
        }
        
        else{
            console.log("Admin role found");
        }
        const data = req.body;
        const newCandidate  = new Candidate (data);
        const response = await newCandidate .save();
        console.log("Data saved");
        res.status(200).json({ response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});





// Corrected password change route
router.put('/:candidateId' , jwtAuthMiddleware, async (req, res) => {    
     try {
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message:"User has not admin role"});
    const candidateId=req.params.candidateId //extract the candidate Id from user paramater
    const updatedCandidateId=req.body;
    const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidateId,{
        new:true,
        runValidators:true
    });
   if(!response){
    return res.status(404).json({message:"Candidate not found"});
   }
   console.log("Candidate data updated");
   res.status(200).json(response);

        
    } catch (err) {  // Add `err` to the catch block
        console.log(err);
        res.status(500).json({ error: "Internal Server error" });  // Changed to 500 for server error
    }
});


router.delete('/:candidateId' , jwtAuthMiddleware, async (req, res) => {    
    try {
       if(!checkAdminRole(req.user.id))
         return res.status(403).json({message:"User has not admin role"});
   const candidateId=req.params.candidateId //extract the candidate Id from user paramater
   const response=await Candidate.findByIdAndDelete(candidateId);
  if(!response){
   return res.status(403).json({message:"Candidate not found"});
  }
  console.log("Candidate data deleted sucessfully");
  res.status(200).json(response);

       
   } catch (err) {  // Add `err` to the catch block
       console.log(err);
       res.status(500).json({ error: "Internal Server error" });  // Changed to 500 for server error
   }
});

router.post('/vote/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    candidateId=req.params.candidateId;
    userId=req.user.id;
    try{
        const candidate=await  Candidate.findById(candidateId);
        if(! candidate){
            return res.status(404).json({message:"Candidate not found"});
        }
        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.isVoted){
            return res.status(400).json({message:"User is already Voted"});
        }
        if(user.role==='Admin'){
            return res.status(403).json({message:"Admin is not Alllowed to  vote"});
        }

        candidate.Votes.push({user:userId});
        candidate.voteCount++;
        await candidate.save();

        user.isVoted=true;
        await user.save();
        res.status(200).json({message:"User voted Sucessfully"});
        


    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }

})

router.get('/vote/count',async (req,res)=>{
    try{
    const candidate=await  Candidate.find().sort({voteCount:'desc'});
    const voteRecord=candidate.map((data)=>{
         return{
            party:data.party,
            count:data.voteCount,
         }
    });
    return res.status(200).json(voteRecord);
}
catch(err){
    res.status(500).json({ error: "Internal server error" });
}
})
router.get('/candidates', async (req, res) => {
    try {
        // Fetch candidates from the database, sorted by voteCount in descending order
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });

        // Check if candidates exist
        if (!candidates || candidates.length === 0) {
            return res.status(404).json({ message: "No candidates found" });
        }

        // Map the candidates to include only name and age in the response
        const candidateRecords = candidates.map(candidate => ({
            name: candidate.name,
            age: candidate.age,
            count:candidate.voteCount
        }));

        // Send the mapped candidate records as the response
        return res.status(200).json(candidateRecords);
    } catch (err) {
        // Log the error and send a 500 Internal Server Error response
        console.error("Error fetching candidates:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
