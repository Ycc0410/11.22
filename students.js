const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// MongoDB 連接設定
const uri = "mongodb://localhost:27017";
const dbName = '410630908'; // 資料庫名稱
const collectionName = 'studentslist'; // 集合名稱

(async () => {
    const client = new MongoClient(uri);
    try {
        // 連接到 MongoDB
        await client.connect();
        console.log("成功連接到 MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 讀取 CSV 檔案，使用相對路徑
        const results = [];
        fs.createReadStream('./studentslist.csv') // 相對路徑
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                // 插入資料到 MongoDB
                const insertResult = await collection.insertMany(results);
                console.log(`成功插入 ${insertResult.insertedCount} 筆資料！`);

                // 關閉連接
                await client.close();
            });
    } catch (error) {
        console.error("發生錯誤：", error);
    }
})();
