import { Order, OrderDetail } from "../../models/index.js"

class OrdersController {

    index = async(req,res,next) => {
        try{
            const orders = await Order.aggregate([{
               $lookup : {from: 'orderdetails', localField: '_id', foreignField:
                'order_id', as: 'details'}
            }]).exec()

            // console.log(orders)
            res.json(orders)

        }catch(e){
            console.error(e)
            next({message:'problem while processing request', status: 400})
        }
    }

    update = async(req,res,next) => {
        try{
            const {status} = req.body

            await Order.findByIdAndUpdate(req.params.id,{
                status
            })

            res.json({
                success: 'Order updated'
            })
        
        }catch(e){
            console.error(e)
            next({message:'problem while processing request', status: 400})
        }
    }

    destroy = async(req,res,next) => {
        try{
            const details = await OrderDetail.find({
                order_id: req.params.id
            }).exec()
                
            // res.json(details)

            for(let detail of details){
                await detail.deleteOne()
            }

            await Order.findByIdAndDelete(req.params.id)

            res.json({
                success: 'Order removed'
            })

        }catch(e){
            console.error(e)
            next({message:'problem while processing request', status: 400})
        }
    }

}


export default new OrdersController