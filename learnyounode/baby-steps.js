let total = 0;
process.argv.forEach((val, index) => {
	total += index > 1 ? Number(val) : 0;
});

console.log(total);
