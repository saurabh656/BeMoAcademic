import { createRouter,createWebHistory } from 'vue-router';

// export function DragDrop(view) {
//   return () => import(`@/views/${view}`);
// }

const routes=[
  
      
      {
        name: "ColumnList", 
        // component: DragDrop("Column/ColumnList.vue"),
        path: "/",
      },
    
]

const router = createRouter({
    history:createWebHistory(),
    routes,
});


export default router;