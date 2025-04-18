import mongoose , {Schema, Document} from 'mongoose';

export interface Message extends Document{
    content:string,
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required:true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    email:string,
    password:string,
    verifyCode:String,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const UserSchema : Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique:[true, "Username already exists!"],
        trim:true
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique:[true, "User with this email already exists" ],
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required!"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required!"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code expiry is required!"]
    },
    isVerified:{
        type: Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;