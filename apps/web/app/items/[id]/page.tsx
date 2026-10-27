import {ItemDetail} from "@/components/item-detail";
export default async function Page({params}:{params:Promise<{id:string}>}){return <ItemDetail id={(await params).id}/>;}
