import AdminNav from "@/components/admin/adminNav";
import { title } from "process";

export const metadata = {
    title:"MT-SHOP Admin",
    description : "MT-Shop Admin Dashboard"
}



const AdminLayout = ({children}:{children: React.ReactNode}) => {
    return ( 

        <div>
            <div>
                <AdminNav/>
            </div>
            {children}
        </div>
     );
}
 
export default AdminLayout;